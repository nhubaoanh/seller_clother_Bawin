import React from "react";

interface NavButtonProps {
  text: string;
  isActive: boolean;
  onClick: () => void;
}

export const NavButton: React.FC<NavButtonProps> = ({
  text,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundImage: `url('/images/button.png')`, // Chỉ 1 file ảnh duy nhất
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        height: "60px",
      }}
      className={`
        relative px-6 py-6 font-bold uppercase tracking-wide transition-all duration-300 cursor-pointer
        ${
          isActive
            ? "text-back scale-105"
            : "text-red-500 border-yellow-500/50 "
        }
      `}
    >
      <span className="font-display">{text}</span>
    </button>
  );
};
