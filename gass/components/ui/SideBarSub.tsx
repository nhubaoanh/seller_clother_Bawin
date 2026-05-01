import React from "react";

interface SidebarProps {
  items: string[];
  activeItem?: string;
  onSelect?: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItem,
  onSelect,
}) => {
  return (
    <div className="w-48 md:w-64 flex-none p-4 pt-8 hidden md:block relative z-20">
      <div className="flex flex-col gap-6 sticky top-4">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect && onSelect(item)}
            className="group relative h-12 w-full transition-transform hover:translate-x-2"
          >
            {/* Hình dạng nút kiểu cuốn thư/thẻ bài */}
            <div className="absolute inset-0 bg-[#eaddcf] border-2 border-[#8b5e3c] rounded-r-xl rounded-l-sm shadow-[2px_4px_6px_rgba(0,0,0,0.2)] transform skew-x-[-5deg] origin-bottom-left flex items-center justify-center group-hover:bg-[#f5ebe0] group-hover:border-red-800">
              {/* Họa tiết trang trí nhỏ */}
              <div className="absolute left-1 top-1 bottom-1 w-1 bg-[#8b5e3c]/30 rounded-full"></div>
              <span className="font-display font-bold text-[#5d4037] group-hover:text-red-900 text-lg relative z-10 transform skew-x-[5deg]">
                {item}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
