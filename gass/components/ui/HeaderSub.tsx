import React from "react";
import { NavButton } from "./NavButton"; 
import { ViewMode } from "@/types/familytree";
import Image from "next/image";


interface HeaderProps {
  activeView: string;
  onNavigate: (view: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { key: ViewMode.PHA_KY, label: "Phả Ký" },
    { key: ViewMode.DIAGRAM, label: "Phả Đồ" },
    { key: ViewMode.HISTORY, label: "Sự Kiện" },
    { key: ViewMode.NEWS, label: "Tin Tức" },
  ];

  return (
    <header className="w-full h-[180px] sm:h-[180px] bg-gradient-to-b bg-[#ede5b7] relative overflow-hidden border-b-1 border-yellow-600/50">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>

      <div className="relative z-10 h-full grid grid-cols-3 gap-2 items-center px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-start items-center opacity-80 hover:opacity-100 transition-opacity h-full">
          <Image
            src="/images/en.png"
            alt="Dao"
            width={230}
            height={230}
            quality={80}
          />
        </div>
        <div className="flex flex-col items-center justify-center h-full pt-2">
          <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
            <Image
              src="/images/logo1.png"
              alt="Dao"
              width={280}
              height={280}
              quality={80}
            />
          </div>
          <nav className="flex flex-wrap justify-center text-[17px] items-center gap-3 md:gap-4 w-full absolute bottom-2">
            {navItems.map((item) => (
              <NavButton
                key={item.key}
                text={item.label}
                isActive={activeView === item.key}
                onClick={() => onNavigate(item.key)}
              />
            ))}
          </nav>
        </div>
        <div className="flex justify-end items-center opacity-80 hover:opacity-100 transition-opacity h-full">
          <Image
            src="/images/backgroudrignt.png"
            alt="Dao"
            width={280}
            height={280}
            quality={80}
          />
        </div>
      </div>
    </header>
  );
};