"use client";
import { useAppFunctions } from "~/hooks/use_appfuncs";
import { useState } from "react";
import DynamicIcon from "./icons/Icon";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import PrinterSelect from "./printer_select";

interface WindowsTitleBarProps {
  title?: string;
  toggleNav: () => void;
}

export function TitleBar({
  title = "Window Title",
  toggleNav,
}: Readonly<WindowsTitleBarProps>) {
  const { onClose, onMaximize, onMinimize, onRestore } = useAppFunctions();
  const [isMaximized, setIsMaximized] = useState(false);

  const handleMaximize = () => {
    isMaximized ? onRestore() : onMaximize();
    setIsMaximized(!isMaximized);
  };

  return (
      <div className='flex h-8 w-full items-center justify-between bg-gray-900 text-white select-none'>
        <div className='flex items-center px-2 gap-2 flex-grow'>
          <button
            onClick={toggleNav}
            className='flex h-full rounded-md w-12 items-center justify-center transition-colors hover:bg-[#333333] focus:border-none focus:outline-none'
            aria-label='Menu'>
            <DynamicIcon color='#ffffff' size={30} name='menu' />
          </button>
          
          <div className="flex flex-1 items-center justify-center relative titlebar">
  {/* Left-aligned title */}
  <span className="absolute left-0 text-sm font-medium pl-3 select-none">
    {title}
  </span>

  {/* Centered dropdown — must be no-drag */}
  <div className="drag-false z-10">
    <PrinterSelect/>
  </div>
</div>
        </div>
        <div className='flex h-full'>
          <button
            onClick={onMinimize}
            className='flex h-full w-12 items-center justify-center transition-colors hover:bg-[#333333]'
            aria-label='Minimize'>
            <DynamicIcon color='#ffffff' size={15} name='minus' />
          </button>
          <button
            onClick={handleMaximize}
            className='flex h-full w-12 items-center justify-center transition-colors hover:bg-[#333333]'
            aria-label={isMaximized ? "Restore Down" : "Maximize"}>
            {isMaximized ? (
              <DynamicIcon color='#ffffff' size={15} name='minimize' />
            ) : (
              <DynamicIcon color='#ffffff' size={15} name='maximize' />
            )}
          </button>
          <button
            onClick={onClose}
            className='flex h-full w-12 items-center justify-center transition-colors hover:bg-[#E81123]'
            aria-label='Close'>
            <DynamicIcon color='#ffffff' size={20} name='close' />
          </button>
        </div>
      </div>
  );
}
