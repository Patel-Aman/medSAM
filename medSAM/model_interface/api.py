from flask import Flask, request, jsonify, send_file
import os
import uuid
from skimage import io, transform
import numpy as np
import torch
from segment_anything import sam_model_registry
import torch.nn.functional as F
from flask_cors import CORS
import base64

join = os.path.join

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return "Welcome to the MedSAM Backend", 200

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({"error": "Please provide an 'file' file"}), 400

    image_file = request.files['file']
    if image_file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Generate a unique ID for the image
    image_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_FOLDER, f"{image_id}.png")

    # Save the image
    image_file.save(file_path)
    return jsonify({"path": image_id}), 200

@app.route('/new-box', methods=['POST'])
def segment_image():
    # parse the request
    data = request.json
    if 'filePath' not in data or 'boundingBox' not in data:
        return jsonify({"error": "Please provide both 'image_id' and 'boundingBox'"}), 400

    image_id = data['filePath']
    box = data['boundingBox']

    try:
        # Validate box
        box_np = np.array([[int(x) for x in box.split(',')]])
    except ValueError:
        return jsonify({"error": "Invalid box format. Use 'x1,y1,x2,y2'"}), 400

    # Load the corresponding image
    file_path = os.path.join(UPLOAD_FOLDER, f"{image_id}.png")
    if not os.path.exists(file_path):
        return jsonify({"error": f"No image found with ID: {image_id}"}), 404

    img_np = io.imread(file_path)

    # Load the model once globally
    device = "cuda:0"
    checkpoint_path = "/home/aman/Documents/Projects/silverllc/Aman_Gocha/medSAM/model_interface/work_dir/MedSAM/medsam_vit_b.pth"
    medsam_model = sam_model_registry["vit_b"](checkpoint=checkpoint_path)
    medsam_model = medsam_model.to(device)
    medsam_model.eval()

    if len(img_np.shape) == 2:
        img_3c = np.repeat(img_np[:, :, None], 3, axis=-1)
    else:
        img_3c = img_np
    H, W, _ = img_3c.shape

    # %% image preprocessing
    img_1024 = transform.resize(
        img_3c, (1024, 1024), order=3, preserve_range=True, anti_aliasing=True
    ).astype(np.uint8)
    img_1024 = (img_1024 - img_1024.min()) / np.clip(
        img_1024.max() - img_1024.min(), a_min=1e-8, a_max=None
    )  # normalize to [0, 1], (H, W, 3)
    # convert the shape to (3, H, W)
    img_1024_tensor = (
        torch.tensor(img_1024).float().permute(2, 0, 1).unsqueeze(0).to(device)
    )

    # transfer box_np t0 1024x1024 scale
    box_1024 = box_np / np.array([W, H, W, H]) * 1024

    with torch.no_grad():
        image_embedding = medsam_model.image_encoder(img_1024_tensor)  # (1, 256, 64, 64)
    
    box_torch = torch.as_tensor(box_1024, dtype=torch.float, device=image_embedding.device)
    if len(box_torch.shape) == 2:
        box_torch = box_torch[:, None, :]  # (B, 1, 4)

    sparse_embeddings, dense_embeddings = medsam_model.prompt_encoder(
        points=None,
        boxes=box_torch,
        masks=None,
    )
    low_res_logits, _ = medsam_model.mask_decoder(
        image_embeddings=image_embedding,
        image_pe=medsam_model.prompt_encoder.get_dense_pe(),
        sparse_prompt_embeddings=sparse_embeddings,
        dense_prompt_embeddings=dense_embeddings,
        multimask_output=False,
    )

    low_res_pred = torch.sigmoid(low_res_logits)
    low_res_pred = F.interpolate(
        low_res_pred, size=(H, W), mode="bilinear", align_corners=False
    )
    low_res_pred = low_res_pred.detach().squeeze().cpu().numpy()
    medsam_seg = (low_res_pred > 0.5).astype(np.uint8)

    # Resize the segmentation mask to the original image size
    resized_mask = transform.resize(medsam_seg, (H, W), order=0, preserve_range=True, anti_aliasing=False).astype(np.uint8)

    # Convert the mask to a grayscale format (0 to 255)
    resized_mask = resized_mask * 255  # Convert binary mask to a range of 0-255

    color = np.concatenate([np.random.random(3), np.array([0.6])], axis=0)

    darker_color = color[:3] * 0.5 # the lower the number darker the mask

    # Create an RGBA image
    rgba_image = np.zeros((H, W, 4), dtype=np.float32)
    for c in range(3):  # Assign the random color to RGB channels
        rgba_image[:, :, c] = resized_mask * darker_color[c]
    rgba_image[:, :, 3] = resized_mask * 0.6  # 0.6 is alpha value

    # Convert to 8-bit format for saving
    rgba_image = (rgba_image * 255).astype(np.uint8)

    # Save the resized mask as a PNG image
    temp_path = join('./static/results', "seg_" + image_id) + ".png"
    io.imsave(temp_path, rgba_image)

    # Read the saved file and encode it to base64
    with open(temp_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')

    # Optionally, clean up the temporary file
    os.remove(temp_path)

    # Return base64-encoded image in the response
    return jsonify({"mask_image": base64_image}), 200


if __name__ == '__main__':
    app.run(debug=True, port='5000')