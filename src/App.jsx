import { useEffect, useState } from "react";

import Admin from "./Admin";
import AdminLogin from "./AdminLogin";

import { Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";
import { FaTelegramPlane, FaFacebookF, FaHeart } from "react-icons/fa";


import Login from "./Login";
import Register from "./Register";
import Watch from "./Watch";
import SeriesPage from "./SeriesPage";
import AdBanner from "./AdBanner.jsx";
import HeroBanner from "./HeroBanner.jsx";
import NetflixRow from "./NetflixRow";
import PrivacyPolicy from "./PrivacyPolicy";
import Terms from "./Terms";
import Disclaimer from "./Disclaimer";
import DMCA from "./DMCA";
import Contact from "./Contact";
import About from "./About";
import Navbar from "./Navbar";
import AllVideos from "./AllVideos";
import SuperAdminRoute from "./SuperAdminRoute";
import AdminControl from "./AdminControl";



import { loadAds } from "./AdManager";
import { db, auth } from "./firebase/firebase-config";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

import { onAuthStateChanged, signOut } from "firebase/auth";

/* ---------------- APP ---------------- */

export default function App() {
  return (
    <Routes>
      <Route path="/series/:name" element={<SeriesPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/watch/:id" element={<Watch />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/dmca" element={<DMCA />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/all-videos" element={<AllVideos />} />
      <Route
  path="/admin/control"
  element={
    <SuperAdminRoute>
      <AdminControl />
    </SuperAdminRoute>
  }
/>
    </Routes>
    
  );
}

/* ---------------- HOME PAGE ---------------- */

function HomePage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState({});
  const [trending, setTrending] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllVideos, setShowAllVideos] = useState(false);
const [featuredVideos, setFeaturedVideos] = useState([]);

const location = useLocation();

// VISITIR
useEffect(() => {
  const visitorId = localStorage.getItem("visitorId") || uuidv4();
  localStorage.setItem("visitorId", visitorId);

  setDoc(doc(db, "visitors", visitorId), {
    lastActive: serverTimestamp(),
    page: window.location.pathname,
  });
}, []);

// ADMIN page e ads off
useEffect(() => {
  const isAdmin =
    location.pathname.startsWith("/admin");

  if (!isAdmin) {
    loadAds();
  }
}, [location.pathname]);
  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
  const fetchMovies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "videos"));
const q = query(
  collection(db, "videos"),
  orderBy("createdAt", "desc"),
  limit(30)
);

const snapshot = await getDocs(q);

const movieList = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));
      

      querySnapshot.forEach((doc) => {
        movieList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      movieList.sort((a, b) => {
  const aTime =
    a.createdAt?.seconds ||
    a.createdAt?.toMillis?.() ||
    0;

  const bTime =
    b.createdAt?.seconds ||
    b.createdAt?.toMillis?.() ||
    0;

  return bTime - aTime; // newest first
});

      console.log("VIDEOS LOADED:", movieList);

      const grouped = {};

movieList.forEach((video) => {
  const name = video.series || video.title;

  if (!grouped[name]) {
    grouped[name] = [];
  }

  grouped[name].push(video);
});

      setTrending(
        Object.entries(grouped).map(([name, eps]) => ({
          id: name,
          title: name,
          image: eps?.[0]?.image || "",
          views: eps.reduce((sum, v) => sum + (v.views || 0), 0),
        }))
      );

      setNewVideos(
  Object.entries(grouped)
    .map(([name, eps]) => ({
      id: name,
      title: name,
      image: eps[0]?.image || "",
      createdAt: eps[0]?.createdAt || null,
    }))
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    })
);

      const singles = movieList
        .filter((v) => v.type === "single")
        .slice(0, 12);

      setFeaturedVideos(singles);

    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };
  

  fetchMovies();
}, []);


        

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) =>
      prev === Object.values(movies).length - 1
        ? 0
        : prev + 1
    );
  }, 5000);

  return () => clearInterval(interval);
}, [movies]);

  /* ---------- AUTH ---------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const [continueWatching, setContinueWatching] = useState([]);

useEffect(() => {
  const fetchProgress = async () => {
    if (!currentUser) return;

    const snap = await getDocs(collection(db, "watchProgress"));

    const list = [];

    snap.forEach((doc) => {
      const data = doc.data();

      if (data.userId === currentUser.uid && data.progress < 95) {
        list.push(data);
      }
    });

    setContinueWatching(list);
  };

  fetchProgress();
}, [currentUser]);

  /* ---------- SEARCH FILTER ---------- */
  const filteredTrending = trending.filter((item) =>
  item.title.toLowerCase().includes(search.toLowerCase())
);

const filteredNew = newVideos.filter((item) =>
  item.title.toLowerCase().includes(search.toLowerCase())
);
  /* ---------- COMPONENT ---------- */
  function SectionCarousel({ title, items, onClick }) {
  return (
    <div className= "px-5 md:px-10 py-6">

      <h2 className="text-3xl font-black mb-5">
        {title}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">

        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onClick(item)}
            className="min-w-[220px] snap-start bg-white/5 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300 hover:shadow-2xl hover:shadow-red-600/20"
          >

            <img
              src={item.image}
              className="w-full h-72 object-cover"
            />

            <div className="p-3">
              <h3 className="font-bold text-lg">
                {item.title}
              </h3>

              <p className="text-gray-400 text-sm">
                 {item.views || 0}
              </p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

  const heroSeries = Object.values(movies)[currentSlide];
  const heroVideo = heroSeries?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white">
      
<Navbar search={search} setSearch={setSearch} />

      {/* HERO */}
     <div className="relative">
  <HeroBanner items={newVideos} />

  {/* dark overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
</div>
      <AdBanner />

      <NetflixRow
  title=" Featured Videos"
  items={featuredVideos}
/>

      {/* TRENDING */}
      <NetflixRow
  title="Trending Now"
  items={filteredTrending}
/>


      {/* NEW */}
      <NetflixRow
  title="New Releases"
  items={newVideos}
/>
          
      {/* ALL SERIES */}
      <NetflixRow
        title="Continue Watching"
        items={filteredTrending.slice(0, 10)}
      />
{showAllVideos && (
  <div className="px-5 md:px-10 py-6">
    
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-3xl font-black">All Videos</h2>

      <button
        onClick={() => setShowAllVideos(false)}
        className="bg-red-600 px-4 py-2 rounded"
      >
        Close
      </button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {Object.values(movies)
        .flat()
        .map((video) => (
          <div
            key={video.id}
            className="bg-white/5 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition"
            onClick={() => window.location.href = `/watch/${video.id}`}
          >
            <img
              src={video.image}
              className="w-full h-60 object-cover"
            />
            <div className="p-3">
              <h3 className="font-bold">{video.title}</h3>
            </div>
          </div>
        ))}
    </div>
  </div>
)}
      
      

      

<footer className="px-6 py-10 border-t border-gray-800 bg-black text-center">

  {/* TITLE / BRAND */}
  <h2 className="text-2xl font-bold mb-4 text-white">
    DarkCity
  </h2>

  <p className="text-gray-400 mb-6 text-sm">
    © 2026 DarkCity. All rights reserved.
  </p>

  {/* SOCIAL ICONS */}
  <div className="flex justify-center gap-8 text-2xl mb-6">

    <a
      href="https://t.me/+MXFAzAhkwmRiMTI1"
      target="_blank"
      rel="noopener noreferrer"
      className="text-sky-400 hover:text-sky-300 hover:drop-shadow-[0_0_10px_#38bdf8] transition transform hover:scale-125"
    >
      <FaTelegramPlane />
    </a>

    <a
      href="https://facebook.com/sexbanglafmz"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:text-blue-400 hover:drop-shadow-[0_0_10px_#3b82f6] transition transform hover:scale-125"
    >
      <FaFacebookF />
    </a>

  </div>

  {/* LINKS */}
  <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-400">

<Link className="hover:text-red-500 transition" to="/about">
      About
    </Link>
    <Link className="hover:text-red-500 transition" to="/privacy-policy">
      Privacy Policy
    </Link>

    <Link className="hover:text-red-500 transition" to="/terms">
      Terms
    </Link>

    <Link className="hover:text-red-500 transition" to="/disclaimer">
      Disclaimer
    </Link>

    <Link className="hover:text-red-500 transition" to="/dmca">
      DMCA
    </Link>

    <Link className="hover:text-red-500 transition" to="/contact">
      Contact
    </Link>

  </div>

  {/* SMALL FOOTER NOTE */}
  <div className="mt-6 text-gray-600 text-xs flex items-center justify-center gap-1">
    Made with <FaHeart className="text-red-500 animate-pulse" /> for entertainment
  </div>

</footer>

    </div>
  );
}