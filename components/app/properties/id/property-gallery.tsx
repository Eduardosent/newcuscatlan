"use client";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { R2_URL } from "@/config";

export function PropertyGallery({ media }: { media: string[] }) {
  const [index, setIndex] = useState(-1);

  const getFullUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseUrl = R2_URL.endsWith("/") ? R2_URL.slice(0, -1) : R2_URL;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${baseUrl}/${cleanPath}`;
  };

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov|quicktime)$/i.test(url);

  // ESTO TIENE LAS 12 IMÁGENES COMPLETAS PARA EL VISOR
  const slides = media.map((url) => {
    const src = getFullUrl(url);
    if (isVideo(url)) {
      return {
        type: "video" as const,
        width: 1280,
        height: 720,
        sources: [{ src, type: url.toLowerCase().endsWith(".mov") ? "video/quicktime" : "video/mp4" }],
      };
    }
    return { src };
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[300px] md:h-[500px]">
        {media.slice(0, 5).map((url, i) => {
          const isVid = isVideo(url);
          const src = getFullUrl(url);
          const isLast = i === 4;
          const hasMore = media.length > 5;
          
          return (
            <div 
              key={i} 
              className={`relative cursor-pointer overflow-hidden group 
                ${i === 0 ? 'col-span-2 row-span-2 rounded-l-xl' : 'hidden md:block last:rounded-tr-xl'}`}
              onClick={() => setIndex(i)}
            >
              {isVid ? (
                <video src={src} className="object-cover w-full h-full" muted />
              ) : (
                <img src={src} alt="Property" className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
              )}

              {/* OVERLAY DE "+X IMÁGENES" - ESTO ES LO QUE TE FALTABA */}
              {isLast && hasMore && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white transition-colors group-hover:bg-black/50">
                  <span className="text-3xl font-bold">+{media.length - 4}</span>
                  <span className="text-sm font-semibold uppercase tracking-wider">Ver fotos</span>
                </div>
              )}

              {isVid && !isLast && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg text-black font-bold text-xs">▶</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={slides} // Aquí se cargan las 12, no solo 5
        plugins={[Video, Thumbnails]}
        video={{ controls: true, autoPlay: true }}
      />
    </div>
  );
}