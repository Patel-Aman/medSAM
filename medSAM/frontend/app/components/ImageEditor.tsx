import { useRef, useEffect, useState } from "react";
import { sendBoundingBox } from "../services/UploadService";
import useBoundingBoxes from "../hooks/useBoundingBoxes";
import styles from "../styles/global.module.css";

interface ImageEditorProps {
  imageSrc: string;
  imagePath: string;
  model: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  imageSrc,
  imagePath,
  model,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const { boundingBoxes, addBoundingBox, clearBoundingBoxes } =
    useBoundingBoxes();
  const [loading, setLoading] = useState(false); // Loading state
  const [maskImages, setMaskImages] = useState<string[]>([]);

  // Draw the image and boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageSrc ?? "";
      img.onload = () => {
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Redraw bounding boxes
        boundingBoxes.forEach((box) => {
          ctx?.beginPath();
          ctx?.rect(
            box.x * scale,
            box.y * scale,
            box.width * scale,
            box.height * scale
          );
          ctx!.strokeStyle = "red";
          ctx!.lineWidth = 2;
          ctx?.stroke();
          ctx!.fillStyle = "red";
          ctx?.fillText(box.id, box.x * scale + 5, box.y * scale + 15);
        });

        // Overlay the mask image if it's available
        if (maskImages.length > 0) {
          maskImages.forEach((mask) => {
            const maskImg = new Image();
            maskImg.src = `data:image/png;base64,${mask}`;
            maskImg.onload = () => {
              ctx?.drawImage(maskImg, 0, 0, canvas.width, canvas.height);
            };
          });
        }
      };
    }
  }, [imageSrc, boundingBoxes, scale, maskImages]);

  useEffect(() => {
    const handleSubmitBoundingBoxes = async () => {
      if (!imagePath || boundingBoxes.length === 0) {
        return;
      }

      try {
        const lastBox = boundingBoxes[boundingBoxes.length - 1];
        const formattedBoundingBox = `${Math.round(lastBox.x)},${Math.round(
          lastBox.y
        )},${Math.round(lastBox.x + lastBox.width)},${Math.round(
          lastBox.y + lastBox.height
        )}`;
        console.log(formattedBoundingBox);
        setLoading(true); // Start loading
        const maskImageBase64 = await sendBoundingBox(
          imagePath,
          formattedBoundingBox,
          model
        );
        console.log("mask completed");
        setMaskImages((prevState) => [...prevState, maskImageBase64]);
      } catch (error) {
        console.error("Failed to process bounding box:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    handleSubmitBoundingBoxes();
  }, [boundingBoxes, imagePath, model]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;

    setStartPoint({ x, y });
    setIsDrawing(true);
  };

  const handleMouseUp = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    const rect = canvas!.getBoundingClientRect();
    const endX = (event.clientX - rect.left) / scale;
    const endY = (event.clientY - rect.top) / scale;

    const width = endX - startPoint.x;
    const height = endY - startPoint.y;

    addBoundingBox({ x: startPoint.x, y: startPoint.y, width, height });
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const currentX = (event.clientX - rect.left) / scale;
    const currentY = (event.clientY - rect.top) / scale;

    // Clear the canvas and redraw the image and existing bounding boxes
    const img = new Image();
    img.src = imageSrc ?? "";
    img.onload = () => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Redraw existing bounding boxes
      boundingBoxes.forEach((box) => {
        ctx?.beginPath();
        ctx?.rect(
          box.x * scale,
          box.y * scale,
          box.width * scale,
          box.height * scale
        );
        ctx!.strokeStyle = "red";
        ctx!.lineWidth = 2;
        ctx?.stroke();
        ctx?.fillText(box.id, box.x * scale + 5, box.y * scale + 15);
      });

      // Draw the in-progress rectangle
      const width = currentX - startPoint.x;
      const height = currentY - startPoint.y;
      ctx?.beginPath();
      ctx?.rect(
        startPoint.x * scale,
        startPoint.y * scale,
        width * scale,
        height * scale
      );
      ctx!.strokeStyle = "blue";
      ctx!.lineWidth = 1;
      ctx?.stroke();
    };
  };

  const handleZoom = (direction: "in" | "out") => {
    setScale((prevScale) =>
      direction === "in" ? prevScale * 1.2 : prevScale * 0.8
    );
  };

  const handleFullScreen = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      if (canvas.requestFullscreen) canvas.requestFullscreen();
    }
  };

  const handleClear = () => {
    clearBoundingBoxes();
  };

  const handleClearMask = () => {
    setMaskImages([]);
  };

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => handleZoom("in")}
          className={styles.buttonStyle}
        >
          Zoom In
        </button>
        <button
          onClick={() => handleZoom("out")}
          className={styles.buttonStyle}
        >
          Zoom Out
        </button>
        <button
          onClick={handleFullScreen}
          className={styles.buttonStyle}
        >
          Full Screen
        </button>
        <button
          onClick={handleClear}
          className={styles.buttonStyle}
        >
          Clear Boxes
        </button>
        <button
          onClick={handleClearMask}
          className={styles.buttonStyle}
        >
          Clear Mask
        </button>
      </div>
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid black",
          cursor: "crosshair",
          pointerEvents: loading ? "none" : "auto",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>

      {loading && (
        <div className={styles.LoadingOverlay}>
          <div className={styles.Spinner}></div>
          <p className={styles.LoadingOverlayMessage}>Processing mask...</p>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
