import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function NetflixRow({ title, items , userData }) {
  if (!items || items.length === 0) return null;
  const navigate = useNavigate();
  const ref = useRef(null);
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      const el = ref.current;
      if (!el) return;

      const max = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= max - 5) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 2200);
  };
  

  const stop = () => clearInterval(intervalRef.current);

  useEffect(() => {
    start();
    return stop;
  }, []);

  const isPremiumUser =
  userData?.premium || false;
  

  return (
    <div>
      <h2 className="text-xl md:text-3xl font-black mb-4">
{title}
</h2>

      <div
        ref={ref}
        onMouseEnter={stop}
        onMouseLeave={start}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {items?.map((v, index) => (
          <div
            key={v.id || `${v.title}-${index}`}
            className="min-w-[180px] sm:min-w-[220px] md:min-w-[300px] hover:scale-105 transition duration-300"
            onClick={() => {
              if (v.type === "single") {
                navigate(`/watch/${v.id}`);
              } else {
                navigate(
  `/series/${encodeURIComponent(
    v.series || v.title
  )}`
);
              }
            }}
          >
            
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:border-red-500/40 transition duration-300 shadow-lg hover:shadow-red-600/20">

            {v.featured && (
  <div className="absolute top-2 left-2 bg-yellow-500 px-2 py-1 rounded text-xs font-bold text-black z-10">
     Featured
  </div>
)}

 {v.premium ? (
  <div className="absolute top-2 right-2 bg-purple-600 px-2 py-1 rounded text-xs font-bold z-10">
    Premium
  </div>
) : (
  <div className="absolute top-2 right-2 bg-green-600 px-2 py-1 rounded text-xs font-bold z-10">
    Free
  </div>
)}
{v.premium ? (
  <>
    <div className="absolute top-2 right-2 bg-purple-600 px-2 py-1 rounded text-xs font-bold z-10">
      Premium
    </div>

    <div className="absolute bottom-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold z-10">
      🪙 {v.coinCost || 50}
    </div>
  </>
) : (
  <div className="absolute top-2 right-2 bg-green-600 px-2 py-1 rounded text-xs font-bold z-10">
    FREE
  </div>
)}

             <img
  src={v.image || "/placeholder.jpg"}
  alt={v.title}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.src = "/placeholder.jpg";
  }}
  className="h-48 sm:h-60 md:h-72 w-full object-cover"
/>
             

              <div className="p-3">
                <div className="px-5 md:px-10 py-6">
                  <h3 className="font-bold">{v.title}</h3>
                  <p className="text-gray-400 text-sm">
                    {v.views || 0} views
                  </p>

                  <button
  onClick={(e) => {
    e.stopPropagation();

    if (v.type === "single") {
      navigate(`/watch/${v.id}`);
    } else {
      navigate(`/series/${encodeURIComponent(v.title)}`);
    }
  }}
  className="
    mt-3
    w-full
    bg-red-600
    hover:bg-red-700
    py-2
    rounded-lg
    font-bold
  "
>
  ▶ Watch
</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}