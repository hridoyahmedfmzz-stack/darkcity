import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "./firebase/firebase-config";
import { shouldShowAd } from "./utils/adController";
import { getUserGeo } from "./utils/geo";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  increment,
  setDoc
} from "firebase/firestore";

import Navbar from "./Navbar";
import AdBanner from "./AdBanner.jsx";


export default function Watch() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);
const [adTimer, setAdTimer] = useState(null);
const [geo, setGeo] = useState({ country: "BD", isHighCPM: false });
  const videoRef = useRef(null);

  useEffect(() => {
  const loadGeo = async () => {
    const data = await getUserGeo();
    setGeo(data);
  };

  loadGeo();
}, []);
  /* ---------------- SAVE PROGRESS ---------------- */
  const saveProgress = async (percent) => {
    if (!auth.currentUser) return;

    await setDoc(
      doc(db, "watchProgress", auth.currentUser.uid + "_" + id),
      {
        userId: auth.currentUser.uid,
        videoId: id,
        progress: percent,
        updatedAt: Date.now(),
      }
    );
  };

  const handleTimeUpdate = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    const percent = Math.floor((current / duration) * 100);

        if (percent % 5 === 0) {
          saveProgress(percent);
        }

    saveProgress(percent);
  };

  /* ---------------- FETCH VIDEO ---------------- */
  useEffect(() => {
    const fetchVideo = async () => {
      const snap = await getDoc(doc(db, "videos", id));

      if (!snap.exists()) return;

      const data = { id: snap.id, ...snap.data() };
      setVideo(data);

      await updateDoc(doc(db, "videos", id), {
        views: increment(1),
      });

      /* ---------------- EPISODES ---------------- */
      const all = await getDocs(collection(db, "videos"));

      const eps = [];

      all.forEach((d) => {
        const v = d.data();
        if (v.series === data.series) {
          eps.push({ id: d.id, ...v });
        }
      });

      eps.sort((a, b) => (a.episode || 0) - (b.episode || 0));

      setEpisodes(eps);

      const index = eps.findIndex((e) => e.id === id);
      setCurrentIndex(index);

      /* ---------------- RECOMMENDED ---------------- */
      const rec = [];

      all.forEach((d) => {
        if (d.id !== id) {
          rec.push({ id: d.id, ...d.data() });
        }
      });

      setRecommended(rec.slice(0, 8));
    };

    fetchVideo();
  }, [id]);

  /* ---------------- AUTO NEXT ---------------- */
  const playNext = () => {
    if (currentIndex < episodes.length - 1) {
      const next = episodes[currentIndex + 1];
      window.location.href = "/watch/" + next.id;
    }
  };

  /* ---------------- PREMIUM CHECK ---------------- */
  const isPremiumLocked = () => {
    if (!video?.premium) return false;

    const user = auth.currentUser;
    if (!user) return true;

    // NOTE: user premium check must come from users collection
    return false;
  };

  /* ---------------- CONTINUE WATCHING RESTORE ---------------- */
  useEffect(() => {
    const restoreProgress = async () => {
      if (!auth.currentUser || !videoRef.current) return;

      const snap = await getDocs(collection(db, "watchProgress"));

      snap.forEach((d) => {
        const data = d.data();

        if (
          data.userId === auth.currentUser.uid &&
          data.videoId === id
        ) {
          const interval = setInterval(() => {
            if (videoRef.current && videoRef.current.duration) {
              videoRef.current.onloadedmetadata = () => {
                const duration = videoRef.current.duration;
                const progress = Number(data.progress);

                if (
                  Number.isFinite(videoRef.current.duration) &&
                  Number.isFinite(Number(data.progress))
                ) {
                  videoRef.current.currentTime =
                    (videoRef.current.duration * Number(data.progress)) /
                    100;
                }
              };
              clearInterval(interval);
            }
          }, 500);
        }
      });
    };

    restoreProgress();
  }, [video]);

 useEffect(() => {
  if (!videoRef.current) return;

  const video = videoRef.current;

  let lastAdTime = 0;

  const handleTimeUpdate = () => {
    const current = video.currentTime;

    // every 30 seconds trigger ad
    if (current - lastAdTime >= 30 && current > 5) {
      lastAdTime = current;

      video.pause();
      setShowAd(true);

      // load Monetag ad
      const s = document.createElement("script");
      s.src = "https://al5sm.com/tag.min.js";
      s.dataset.zone = "11112609";
      s.async = true;
      document.body.appendChild(s);
    }
  };

  video.addEventListener("timeupdate", handleTimeUpdate);

  return () => video.removeEventListener("timeupdate", handleTimeUpdate);
}, [video]);

useEffect(() => {
  if (!videoRef.current) return;

  const video = videoRef.current;

  let lastAd = 0;

  const handleTimeUpdate = () => {
    const time = Math.floor(video.currentTime);

    if (shouldShowAd(geo, time) && time - lastAd > 5) {
      lastAd = time;

      video.pause();

      const s = document.createElement("script");
      s.src = "https://al5sm.com/tag.min.js";
      s.dataset.zone = "11112609";
      s.async = true;
      document.body.appendChild(s);
    }
  };

  video.addEventListener("timeupdate", handleTimeUpdate);

  return () => video.removeEventListener("timeupdate", handleTimeUpdate);
}, [geo]);

useEffect(() => {
  if (!showAd) return;

  const timer = setTimeout(() => {
    setShowAd(false);

    if (videoRef.current) {
      videoRef.current.play();
    }
  }, 8000); // 8 sec ad duration

  return () => clearTimeout(timer);
}, [showAd]);

  if (!video) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <AdBanner />

      <div className="max-w-6xl mx-auto p-5">

        <h1 className="text-4xl font-black mb-6 text-white-500">
          {video.title}
        </h1>

        {/* PREMIUM LOCK */}
        {isPremiumLocked() ? (
          <div className="p-10 bg-red-600 rounded-2xl text-center">
            <h2 className="text-2xl font-bold">
              Premium Required
            </h2>
          </div>
        ) : (
          <video
  id="darkcity-player"
  ref={videoRef}
  controls
  autoPlay
  playsInline
  onTimeUpdate={handleTimeUpdate}
  onEnded={playNext}
  className="w-full h-[35vh] md:h-[70vh] bg-black rounded-2xl"
>
  <source src={video.videoUrl} type="video/mp4" />
</video>
        )}

        {showAd && (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
    
    <div className="bg-white/10 p-6 rounded-2xl text-center w-[90%] max-w-md">

      <h2 className="text-xl font-bold mb-3">
        Advertisement
      </h2>

      {/* Ad container */}
      <div className="mb-4">
  <a
    href="https://omg10.com/4/10937558"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src="https://via.placeholder.com/728x90?text=Advertisement"
      alt="Advertisement"
      className="w-full rounded-lg"
    />
  </a>
</div>
      <p className="text-sm text-gray-300">
        Video will resume shortly...
      </p>

      <button
        onClick={() => {
          setShowAd(false);
          videoRef.current.play();
        }}
        className="mt-4 bg-red-600 px-5 py-2 rounded"
      >
        Skip / Continue
      </button>

    </div>

  </div>
)}

        {/* RECOMMENDED */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">
            Recommended
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommended.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  (window.location.href = "/watch/" + item.id)
                }
                className="bg-white/5 rounded-xl overflow-hidden cursor-pointer"
              >
                <img src={item.image} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-bold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}