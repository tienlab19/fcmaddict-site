/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

export function ImageOrInitial({ src, name, className = "tool-image" }: { src: string; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <span className={`${className} image-fallback`}>{name.trim().slice(0, 2).toUpperCase() || "FC"}</span>;
  }
  return <img className={className} src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />;
}
