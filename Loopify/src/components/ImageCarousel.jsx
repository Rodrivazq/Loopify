import { useEffect, useState } from "react";
import "./ImageCarousel.css";

export default function ImageCarousel({ images = [] }) {
  const pics = images.length ? images : ["/placeholder.png"];
  const [idx, setIdx] = useState(0);

  useEffect(() => { setIdx(0); }, [images.length]); // reset al cambiar de producto

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(pics.length - 1, i + 1));

  const single = pics.length === 1;

  return (
    <div className="caro">
      <button className="caro-nav left" onClick={prev} disabled={single || idx===0}>‹</button>
      <figure className="caro-frame">
        <img src={pics[idx]} alt={`foto ${idx+1}`} className="caro-img" />
      </figure>
      <button className="caro-nav right" onClick={next} disabled={single || idx===pics.length-1}>›</button>

      <div className="caro-dots">
        {pics.map((_, i) => (
          <button
            key={i}
            className={"dot" + (i===idx ? " active" : "")}
            onClick={() => setIdx(i)}
            aria-label={`Ir a imagen ${i+1}`}
          />
        ))}
      </div>
    </div>
  );
}
