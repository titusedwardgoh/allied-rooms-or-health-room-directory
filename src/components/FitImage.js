"use client";

import { useEffect, useRef, useState } from "react";

function isPortrait(width, height) {
  return Number(height) > Number(width);
}

function readPortrait(img) {
  if (!img?.naturalWidth || !img?.naturalHeight) return false;
  return isPortrait(img.naturalWidth, img.naturalHeight);
}

export default function FitImage({
  src,
  alt = "",
  className = "",
  coverClassName = "",
  containClassName = "",
}) {
  const imgRef = useRef(null);
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) {
      setPortrait(readPortrait(img));
      return;
    }
    setPortrait(false);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onLoad={(event) => setPortrait(readPortrait(event.currentTarget))}
      className={`${className} object-center ${
        portrait
          ? `object-contain ${containClassName}`
          : `object-cover ${coverClassName}`
      }`}
    />
  );
}
