import { NextFunction, Request, Response } from "express";
import { spawn } from "child_process";
import fs from 'fs';
import path from "path";

export const getMask = (req: Request, res: Response, next: NextFunction):void => {
    try {
        console.log('triggered');
        const {filePath, boundingBox} = req.body;

        if (!filePath || !boundingBox) {
            res.status(400).send("Image file and bounding box are required.");
        }

        console.log(boundingBox)

        const outputPath = path.join(__dirname, "../../assets")

        const checkpointPath = "/home/aman/Documents/Projects/silverllc/Aman_Gocha/medSAM/model_interface/work_dir/MedSAM/medsam_vit_b.pth";

        const pythonProcess = spawn("python3", [
          "/home/aman/Documents/Projects/silverllc/Aman_Gocha/medSAM/model_interface/medsam_api.py",
          "-i", filePath,
          "-o", outputPath,
          "-chk", checkpointPath,
          "--box", boundingBox,
          "--device", "cpu"
      ]);
      

        let maskData = "";

        pythonProcess.stdout.on("data", (data) => {
            maskData += data.toString();
        });
        
        pythonProcess.stderr.on("data", (data) => {
            console.error(`Python error: ${data}`);
        });

        pythonProcess.on("close", (code) => {
          if (code === 0) {
              const savedImagePath = path.join(outputPath, `seg_${path.basename(filePath)}.png`);
              if (fs.existsSync(savedImagePath)) {
                  // Send the saved image path or encoded content to the client
                  const base64Image = fs.readFileSync(savedImagePath, { encoding: "base64" });
                  res.json({ mask_image: base64Image });
              } else {
                  res.status(500).send("Segmentation image not found.");
              }
          } else {
              res.status(500).send("Error processing the image.");
              next();
          }
      });
      
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload file.' });
        next();
    }
}