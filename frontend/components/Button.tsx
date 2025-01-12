import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-64 bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-700 transition"
    >
      {label}
    </button>
  );
};

export default Button;
