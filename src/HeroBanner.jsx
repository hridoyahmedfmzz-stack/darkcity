import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroBanner({ items }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const hero = items?.[index];

  useEffect(() => {
    if (!items?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

  if (!hero) return null;
  console.log(hero);

  return (
    <div className="relative h-[60vh] md:h-[85vh] overflow-hidden">
      
     <img
  src={hero.image}
  alt={hero.title}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.src = "/placeholder.jpg";
  }}
  className="absolute w-full h-full object-cover"
/>

      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 h-full flex items-center px-4 md:px-10">
  <div>
    <h1 className="text-3xl md:text-6xl font-black mb-5">
      {hero.title}
    </h1>

    <button
      onClick={() => navigate(`/series/${encodeURIComponent(hero.title)}`)}
      className="bg-red-600 px-5 md:px-6 py-3 rounded-xl font-boldanimate-pulse drop-shadow-[0_0_25px_red]"
    >
      Watch Now
    </button>
  </div>
</div>
      </div>

  );
}
