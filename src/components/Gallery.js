import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import images from "../data/images";

export default function Gallery() {
  const [index, setIndex] = useState(-1);

  return (
    <div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={img.id}
            className="cursor-pointer"
            onClick={() => setIndex(i)}
          >
            <img
              src={img.src}
              alt={img.title}
              className="w-full h-56 object-cover rounded-xl shadow-md hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>

      {index >= 0 && (
        <Lightbox
          open={index >= 0}
          slides={images.map((img) => ({ src: img.src }))}
          index={index}
          close={() => setIndex(-1)}
          controller={{ closeOnBackdropClick: true }}
        />
      )}
    </div>
  );
}
