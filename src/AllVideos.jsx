import { useEffect, useState } from "react";
import { db } from "./firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AdBanner from "./AdBanner.jsx";



export default function AllVideos() {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const snap = await getDocs(collection(db, "videos"));

        const movieList = [];

        snap.forEach((doc) => {
          movieList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Group videos by series
        const grouped = {};

        movieList.forEach((video) => {
          const name = video.series || video.title;

          if (!grouped[name]) {
            grouped[name] = [];
          }

          grouped[name].push(video);
        });

        // Create series cards
       const data = Object.entries(grouped).map(([name, episodes]) => ({
  id: name,
  title: name,
  image: episodes[0]?.image || "",
  episodes: episodes.length,
  views: episodes.reduce((sum, v) => sum + (v.views || 0), 0),
  createdAt: episodes[0]?.createdAt || null,

  premium: episodes.some(ep => ep.premium),
  featured: episodes.some(ep => ep.featured),
}));

        // Sort by latest upload time
        data.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.seconds - a.createdAt.seconds;
        });

        setSeriesList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);
  
  const filteredSeries = seriesList.filter((item) =>
  item.title.toLowerCase().includes(search.toLowerCase())
);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
<Navbar
  search={search}
  setSearch={setSearch}
/>
      <AdBanner />
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-white/10 p-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">
          All Videos
        </h1>

      </div>

      {/* Series Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 p-5">

        {filteredSeries.map((series) => (
          <div
            key={series.id}
            onClick={() =>
              navigate(
                `/series/${encodeURIComponent(series.title)}`
              )
            }
            className="bg-white/5 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition duration-300"
          >
            
            <div className="relative">
  <img
    src={series.image}
    alt={series.title}
    className="w-full h-72 object-cover"
  />

  {series.premium && (
    <div className="absolute top-2 right-2 bg-purple-600 px-2 py-1 rounded text-xs font-bold">
      Premium
    </div>
  )}

  {series.featured && (
    <div className="absolute top-2 left-2 bg-yellow-500 px-2 py-1 rounded text-xs font-bold text-black">
      Featured
    </div>
  )}
</div>

            <div className="p-3">
              <h3 className="font-bold text-lg truncate">
                {series.title}
              </h3>

              <p className="text-gray-400 text-sm">
                {series.episodes} Videos
              </p>

              <p className="text-gray-400 text-sm">
                {series.views.toLocaleString()} Views
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}