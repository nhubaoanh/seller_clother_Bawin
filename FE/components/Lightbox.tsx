'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  initialIndex: number;
  productName: string;
  onClose: () => void;
}

export default function Lightbox({
  images,
  initialIndex,
  productName,
  onClose,
}: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-white/70 hover:text-white transition z-10"
        aria-label="Đóng"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Counter */}
      <p className="absolute top-5 left-6 text-white/60 text-sm font-medium">
        {current + 1} / {images.length} — <span className="text-white/90">{productName}</span>
      </p>

      {/* Main image */}
      <div
        className="relative flex items-center justify-center w-full max-w-4xl max-h-[75vh] px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition backdrop-blur"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <img
          src={images[current]}
          alt={`${productName} - ảnh ${current + 1}`}
          className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl select-none"
          draggable={false}
          style={{ transition: 'opacity .2s' }}
        />
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition backdrop-blur"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex gap-2 mt-5 overflow-x-auto pb-1 px-4"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${idx === current ? 'border-rose-400 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
