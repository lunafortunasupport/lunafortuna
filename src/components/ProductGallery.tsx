"use client";

import { useState } from "react";

// گالریِ محصول: تصویرِ اصلیِ بزرگ + بندانگشتی‌های قابل‌کلیک (پیش‌تر ثابت بودند و کاری نمی‌کردند).
export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const cover = images[active] || images[0];

  return (
    <div>
      <div className="reveal img-wipe relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-card">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={cover} src={cover} alt={title} className="h-full w-full animate-fadeIn object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl text-navy/15">🌙</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden rounded-xl ring-2 transition-all ${
                active === i ? "ring-gold" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`تصویر ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
