import React from "react";

type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded ${
        disabled
          ? "bg-gray-300 cursor-not-allowed text-gray-500"
          : "w-64 bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-700 transition"
      }`}
    >
      {label}
    </button>
  );
};

export default Button;