import { useState } from "react";

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const useBoundingBoxes = () => {
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);

  const addBoundingBox = (box: Omit<BoundingBox, "id">) => {
    const id = `box-${boundingBoxes.length + 1}`;
    setBoundingBoxes([...boundingBoxes, { ...box, id }]);
  };

  const clearBoundingBoxes = () => {
    setBoundingBoxes([]);
  };

  return {
    boundingBoxes,
    addBoundingBox,
    clearBoundingBoxes,
  };
};

export default useBoundingBoxes;
