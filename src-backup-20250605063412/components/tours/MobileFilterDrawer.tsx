'use client';

import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import ToursFilter from './ToursFilter';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFilterDrawer({ isOpen, onClose }: MobileFilterDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-sm transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900">Filter Tours</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <FiX className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        {/* Filter Content */}
        <div className="h-[calc(100%-56px)] overflow-y-auto">
          <ToursFilter />
          
          {/* Apply Button */}
          <div className="sticky bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
            <button 
              className="bg-safari-brown hover:bg-safari-brown/90 w-full rounded-lg py-3 font-medium text-white shadow-md transition-colors"
              onClick={onClose}
            >
              Show {0} Tours
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
