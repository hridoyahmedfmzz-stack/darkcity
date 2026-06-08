import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "./Navbar";
import AdBanner from "./AdBanner.jsx";

export default function SeriesPage() {
  const { name } = useParams();
  const [series, setSeries] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "videos"));

      const eps = [];

      snap.forEach((doc) => {
        const data = doc.data();
        if (data.series === name) {
          eps.push({ id: doc.id, ...data });
        }
      });

      setSeries({
        title: name,
        episodes: eps.sort((a, b) => a.episode - b.episode)
      });
    };

    fetchData();
  }, [name]);

  if (!series) return <div>Loading...</div>;

  return (
    
    <div className="px-3 md:px-5 py-5 text-white bg-black min-h-screen">

      <h1 className="text-4xl font-bold mb-5">
        {series.title}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {series.episodes.map((ep) => (
          <div
            key={ep.id}
            onClick={() =>
              (window.location.href = "/watch/" + ep.id)
            }
            className="bg-white/5 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition"
          >

            <img src={ep.image} className="w-full h-48 object-cover" />

            <div className="p-3">
              <h3 className="font-bold">
                EP {ep.episode} - {ep.title}
              </h3>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}