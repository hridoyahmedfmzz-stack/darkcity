import { useRef } from "react";

export default function Carousel({ title, items, renderItem }) {
  const ref = useRef(null);

  const scroll = (dir) => {
    const amount = 350;

    ref.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full px-5 my-10">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-black">{title}</h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="bg-white/10 px-3 py-1 rounded"
          >
            ◀
          </button>

          <button
            onClick={() => scroll("right")}
            className="bg-white/10 px-3 py-1 rounded"
          >
            ▶
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide"
      >
        {items.map((item, i) => (
          <div key={i} className="min-w-[280px] md:min-w-[320px]">
            {renderItem(item)}
          </div>
        ))}
      </div>

    </div>
  );
}