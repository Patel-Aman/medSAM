import { useRef, useEffect, useState } from "react";
import useBoundingBoxes from "../hooks/useBoundingBoxes";

interface ImageEditorProps {
  imageSrc: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scale, setScale] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const { boundingBoxes, addBoundingBox, clearBoundingBoxes } = useBoundingBoxes();

  // Draw the image and boxes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Redraw bounding boxes
        boundingBoxes.forEach((box) => {
          ctx?.beginPath();
          ctx?.rect(box.x * scale, box.y * scale, box.width * scale, box.height * scale);
          ctx!.strokeStyle = "red";
          ctx!.lineWidth = 2;
          ctx?.stroke();
        //   ctx?.fillStyle = "red";
          ctx?.fillText(box.id, box.x * scale + 5, box.y * scale + 15);
        });
      };
    }
  }, [imageSrc, boundingBoxes, scale]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / scale;
      const y = (event.clientY - rect.top) / scale;

      setStartPoint({ x, y });
      setIsDrawing(true);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
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
    img.src = imageSrc;
    img.onload = () => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  
      // Redraw existing bounding boxes
      boundingBoxes.forEach((box) => {
        ctx?.beginPath();
        ctx?.rect(box.x * scale, box.y * scale, box.width * scale, box.height * scale);
        ctx!.strokeStyle = "red";
        ctx!.lineWidth = 2;
        ctx?.stroke();
        // ctx?.fillStyle = "red";
        ctx?.fillText(box.id, box.x * scale + 5, box.y * scale + 15);
      });
  
      // Draw the in-progress rectangle
      const width = currentX - startPoint.x;
      const height = currentY - startPoint.y;
      ctx?.beginPath();
      ctx?.rect(startPoint.x * scale, startPoint.y * scale, width * scale, height * scale);
      ctx!.strokeStyle = "blue"; // Use a different color for the live preview
      ctx!.lineWidth = 1;
      ctx?.stroke();
    };
  };
  

  const handleZoom = (direction: "in" | "out") => {
    setScale((prevScale) => (direction === "in" ? prevScale * 1.2 : prevScale * 0.8));
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

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => handleZoom("in")} style={buttonStyle}>
          Zoom In
        </button>
        <button onClick={() => handleZoom("out")} style={buttonStyle}>
          Zoom Out
        </button>
        <button onClick={handleFullScreen} style={buttonStyle}>
          Full Screen
        </button>
        <button onClick={handleClear} style={{ ...buttonStyle, backgroundColor: "red", color: "white" }}>
          Clear Boxes
        </button>
      </div>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", cursor: "crosshair" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}   
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
};

const buttonStyle = {
  margin: "5px",
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007BFF",
  color: "white",
};

export default ImageEditor;
