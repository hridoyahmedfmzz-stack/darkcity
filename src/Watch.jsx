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
import {
  isVideoUnlocked,
  unlockVideo
} from "./utils/videoUnlock";

import { showRewardAd } from "./utils/monetag";

import LockedVideo from "./LockedVideo";
import { spendCoins } from "./utils/coins";
import { isVipUser } from "./utils/vip";


export default function Watch() {
  const { id } = useParams();
  const lastAdRef = useRef(0);
  const lastSavedRef = useRef(0);

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);
const [adTimer, setAdTimer] = useState(null);
const [geo, setGeo] = useState({ country: "BD", isHighCPM: false });
  const videoRef = useRef(null);
  const [locked, setLocked] = useState(true);

const [loadingUnlock, setLoadingUnlock] =
  useState(true);
  const videoViewsRef = useRef(0);
const lastInterstitialRef = useRef(0);
const [premiumUnlocked, setPremiumUnlocked] =
  useState(false);
        const viewedRef = useRef(false);


  const isTelegram =
  window.Telegram &&
  window.Telegram.WebApp;

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
    doc(
      db,
      "watchHistory",
      `${auth.currentUser.uid}_${id}`
    ),
    {
      uid: auth.currentUser.uid,
      videoId: id,
      title: video.title,
      image: video.image,
      progress: percent,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
};
const handleTimeUpdate = (e) => {
  const current = e.target.currentTime;
  const duration = e.target.duration;

  if (!duration) return;

  const percent = Math.floor(
    (current / duration) * 100
  );
  
if (
  percent >= lastSavedRef.current + 5
) {
  lastSavedRef.current = percent;
  saveProgress(percent);
}
}
   

  /* ---------------- FETCH VIDEO ---------------- */
  useEffect(() => {
    const fetchVideo = async () => {
      const snap = await getDoc(doc(db, "videos", id));

      if (!snap.exists()) return;

      const data = { id: snap.id, ...snap.data() };
      setVideo(data);





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
    

    const isVip =
  userData?.premium &&
  userData?.premiumExpire > Date.now();

if (video?.premium && !premiumUnlocked && !isVip) {
  return <LockedVideo />;
}
    // NOTE: user premium check must come from users collection
    return false;
  };
   useEffect(() => {
  const checkPremiumUnlock = async () => {

    if (!auth.currentUser || !video) return;

    const userDoc = await getDoc(
      doc(db, "users", auth.currentUser.uid)
    );

    if (
      userDoc.exists() &&
      userDoc.data().premium &&
      userDoc.data().premiumExpire > Date.now()
    ) {
      setPremiumUnlocked(true);
      return;
    }

    const key =
      auth.currentUser.uid + "_" + id;

    const snap = await getDoc(
      doc(db, "premiumUnlocks", key)
    );

    setPremiumUnlocked(snap.exists());
  };

  checkPremiumUnlock();
}, [video, id]);
const unlockPremiumVideo = async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Login Required");
    return;
  }

  const cost = video?.coinCost || 50;

  const success = await spendCoins(user.uid, cost);

  if (!success) {
    alert(`Need ${cost} Coins`);
    return;
  }

  await setDoc(
    doc(db, "premiumUnlocks", `${user.uid}_${id}`),
    {
      uid: user.uid,
      videoId: id,
      unlockedAt: Date.now()
    }
  );

  setPremiumUnlocked(true);

  alert("Premium Unlocked");
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
  if (!showAd) return;

  const timer = setTimeout(() => {
    setShowAd(false);

    if (videoRef.current) {
      videoRef.current.play();
    }
  }, 8000); // 8 sec ad duration

  return () => clearTimeout(timer);
}, [showAd]);

useEffect(() => {
  const checkUnlock = async () => {
    const user = auth.currentUser;

    if (!user) {
      setLocked(true);
      setLoadingUnlock(false);
      return;
    }

    const unlocked = await isVideoUnlocked(
      user.uid,
      id
    );

    setLocked(!unlocked);
    setLoadingUnlock(false);
  };

  checkUnlock();
}, [id]);

const handleUnlock = async () => {
  try {
    setLoadingUnlock(true);
    console.log("Reward button clicked");
    console.log("Reward received");

    await showRewardAd();

    const user = auth.currentUser;

    if (!user) {
      alert("Login Required");
      return;
    }

    await unlockVideo(user.uid, id);

    setLocked(false);

    alert("Video Unlocked");
  } catch (err) {
    console.error(err);
    alert("Ad not completed");
  } finally {
    setLoadingUnlock(false);
  }
};
const claimDailyReward = async () => {
  await showRewardAd();

  await updateDoc(
    doc(db, "users", auth.currentUser.uid),
    {
      coins: increment(20),
      lastClaim: Date.now(),
    }
  );
};
const watchBonusAd = async () => {
  await showRewardAd();

  await updateDoc(
    doc(db, "users", auth.currentUser.uid),
    {
      coins: increment(5),
    }
  );
};

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

      <div className="max-w-[1700px] mx-auto px-4 py-5">

       <h1 className="text-3xl lg:text-5xl font-black mb-6">
          {video.title}
        </h1>

        {/* PREMIUM LOCK */}
        {video?.premium && !premiumUnlocked ? (
          <div className="bg-purple-900 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">
              🔒 Premium Video
            </h2>
            <p className="mb-4">
              Cost: {video.coinCost || 50} Coins
            </p>
            <button
              onClick={unlockPremiumVideo}
              className="bg-purple-600 px-5 py-3 rounded-lg"
            >
              Unlock With Coins
            </button>
          </div>
        ) : (
         <div className="w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
  <video
    ref={videoRef}
    controls
    playsInline
    preload="metadata"
    autoPlay
    onTimeUpdate={handleTimeUpdate}
    onEnded={playNext}
    className="
      w-full
      h-[75vh]
      lg:h-[85vh]
      object-contain
      bg-black
      rounded-2xl
    "
    onError={() => {
      console.log("Video Load Failed");
    }}
  >
    <source src={video.videoUrl} type="video/mp4" />
    Your browser does not support HTML5 video.
  </video>
</div>
        )}
        {/* COINS SECTION */}

<div className="mt-6 bg-white/5 p-4 rounded-xl">

  <h3 className="font-bold mb-3">
    Earn Coins
  </h3>

  <button
  onClick={claimDailyReward}
>
  🎁 Daily Reward
</button>

<button
  onClick={watchBonusAd}
>
  💰 Watch Ad +5 Coins
</button>


</div>


        {showAd && (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
    
    <div className="bg-white/10 p-6 rounded-2xl text-center w-[90%] max-w-md">

      <h2 className="text-xl font-bold mb-3">
        Advertisement
      </h2>

      {/* Ad container */}
      <div className="mb-4">
  <a
    href="https://omg10.com/4/11208077"
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

<AdBanner/>

        {/* RECOMMENDED */}
        <div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">
    Recommended
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    {recommended.map((item) => (
      <div
        key={item.id}
        onClick={() =>
          (window.location.href = "/watch/" + item.id)
        }
        className="
          group
          cursor-pointer
          bg-zinc-900
          rounded-2xl
          overflow-hidden
          hover:scale-105
          transition-all
          duration-300
          hover:shadow-lg
        "
      >
        <div className="relative">
          {item.premium && (
            <div className="
              absolute
              top-2
              right-2
              bg-purple-600
              text-white
              text-xs
              px-2
              py-1
              rounded-lg
              z-10
            ">
              Premium
            </div>
          )}

          <img
            src={item.image}
            alt={item.title}
            className="
              w-full
              h-40
              object-cover
              group-hover:scale-110
              transition
              duration-300
            "
          />
        </div>

        <div className="p-3">
          <h3 className="font-bold line-clamp-2">
            {item.title}
          </h3>
        </div>
      </div>
    ))}
  </div>
</div>
          </div>
        </div>
  );
}