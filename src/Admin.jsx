import { useState, useEffect, useRef } from "react";
import { db, auth } from "./firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query, orderBy
} from "firebase/firestore";

/* ================= ADMIN ================= */

export default function Admin() {
  const [title, setTitle] = useState("");
  const [videoFiles, setVideoFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  const [videos, setVideos] = useState([]);

  const [todayVisitors, setTodayVisitors] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [premiumUsers, setPremiumUsers] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  const [editSeriesPanel, setEditSeriesPanel] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPremium, setEditPremium] = useState(false);
  const [editSeries, setEditSeries] = useState("");
  const [editMode, setEditMode] = useState(null); 
  const [editSeriesName, setEditSeriesName] = useState("");
  const [editSeriesImage, setEditSeriesImage] = useState(null);
  const [editEpisodes, setEditEpisodes] = useState([]);
  const [editEpisode, setEditEpisode] = useState(1);
const [newSeriesTitle, setNewSeriesTitle] = useState("");
const [newSeriesImage, setNewSeriesImage] = useState(null);
const [newEpisodeVideo, setNewEpisodeVideo] = useState(null);
const [newEpisodeThumbnail, setNewEpisodeThumbnail] = useState(null);
const [selectedEpisodeId, setSelectedEpisodeId] = useState(null); 

  const [newThumbnail, setNewThumbnail] = useState(null);
  const [newVideo, setNewVideo] = useState(null);

  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [openSeries, setOpenSeries] = useState(null);
const [search, setSearch] = useState("");
const [visitorCount, setVisitorCount] = useState(0);

// VISITOR
useEffect(() => {
  const fetchVisitors = async () => {
    const snap = await getDocs(collection(db, "visitors"));
    setVisitorCount(snap.size);
  };

  fetchVisitors();
}, []);

// AD OFF
useEffect(() => {
  document
    .querySelectorAll(
      'script[src*="5gvci"],script[src*="al5sm"],script[src*="effectivecpmnetwork"],script[src*="libtl"]'
    )
    .forEach((s) => s.remove());
}, []);

// Remove all ad scripts from admin page
useEffect(() => {
  const adScripts = document.querySelectorAll(
    'script[src*="5gvci"], script[src*="al5sm"], script[src*="effectivecpmnetwork"], script[src*="libtl"], script[src*="monetag"]'
  );

  adScripts.forEach((s) => s.remove());

  // Block future ads injection
  const observer = new MutationObserver(() => {
    document
      .querySelectorAll(
        'script[src*="5gvci"], script[src*="al5sm"], script[src*="effectivecpmnetwork"], script[src*="libtl"], script[src*="monetag"]'
      )
      .forEach((s) => s.remove());
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}, []);
  /* ================= AUTH ================= */
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/admin/login";
        return;
      }

      const adminDoc = await getDoc(doc(db, "admin", user.uid));

      if (!adminDoc.exists()) {
        alert("Access Denied");
        window.location.href = "/";
      }
    });

    return () => unsub();
  }, []);

  /* ================= LOAD ================= */
  useEffect(() => {
    loadVideos();
    loadAnalytics();
  }, []);
  

  /* ================= CLOUDINARY ================= */
  const uploadToCloudinary = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "darkcity");

    const url =
      type === "video"
        ? "https://api.cloudinary.com/v1_1/dpzu3ehtm/video/upload"
        : "https://api.cloudinary.com/v1_1/dpzu3ehtm/image/upload";

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.secure_url) throw new Error("Upload Failed");

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  };

  /* ================= LOAD VIDEOS ================= */
  const loadVideos = async () => {
  try {
    const snapshot = await getDocs(collection(db, "videos"));

    const grouped = {};

    snapshot.forEach((item) => {
      const data = item.data();
      const seriesName = data.series || data.title;

      if (!grouped[seriesName]) {
        grouped[seriesName] = {
          seriesName,
          image: data.image,
          episodes: [],
        };
      }

      grouped[seriesName].episodes.push({
        id: item.id,
        ...data,
      });
    });

    const sortedVideos = Object.values(grouped).sort((a, b) => {
  const aLatest = Math.max(
    ...a.episodes.map(
      (ep) => ep.createdAt?.seconds || 0
    )
  );

  const bLatest = Math.max(
    ...b.episodes.map(
      (ep) => ep.createdAt?.seconds || 0
    )
  );

  return bLatest - aLatest;
});

setVideos(sortedVideos);

  } catch (error) {
    console.log(error);
  }
};


  /* ================= ANALYTICS ================= */
  const loadAnalytics = async () => {
    const today = new Date().toISOString().split("T")[0];

    const visitorSnap = await getDoc(doc(db, "analytics", today));
    setTodayVisitors(visitorSnap.exists() ? visitorSnap.data().visitors : 0);

    const usersSnap = await getDocs(collection(db, "users"));
    let premiumCount = 0;

    usersSnap.forEach((u) => {
      if (u.data().premium) premiumCount++;
    });

    setTotalUsers(usersSnap.size);
    setPremiumUsers(premiumCount);

    const videosSnap = await getDocs(collection(db, "videos"));
    let views = 0;

    videosSnap.forEach((v) => {
      views += v.data().views || 0;
    });

    setTotalViews(views);
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
  if (!title || !videoFiles.length || !imageFiles.length) {
    alert("Fill all fields");
    return;
  }

  try {
    setLoading(true);

    // Single Video
    if (videoFiles.length === 1) {
      const imageData = await uploadToCloudinary(
        imageFiles[0],
        "image"
      );

      const videoData = await uploadToCloudinary(
        videoFiles[0],
        "video"
      );

      await addDoc(collection(db, "videos"), {
        title,
        image: imageData.url,
        videoUrl: videoData.url,
        type: "single",
        premium,
        views: 0,
        createdAt: Date.now(),
        createdAt: serverTimestamp(),
      });
    }

    // Series Upload
    else {
      for (let i = 0; i < videoFiles.length; i++) {
        const imageData = await uploadToCloudinary(
          imageFiles[i] || imageFiles[0],
          "image"
        );

        const videoData = await uploadToCloudinary(
          videoFiles[i],
          "video"
        );

        await addDoc(collection(db, "videos"), {
          title: `${title} VIDEO ${i + 1}`,
          series: title,
          episode: i + 1,
          image: imageData.url,
          videoUrl: videoData.url,
          premium,
          views: 0,
          order: i + 1,
          createdAt: Date.now(),
          createdAt: serverTimestamp(),
        });
      }
    }

    alert("Upload Success");

    setTitle("");
    setVideoFiles([]);
    setImageFiles([]);
    setPremium(false);

    loadVideos();
  } catch (err) {
    console.log(err);
    alert("Upload Failed");
  } finally {
    setLoading(false);
  }
};
const q = query(
  collection(db, "videos"),
  orderBy("createdAt", "desc")
);

  /* ================= DELETE ================= */
  const deleteVideo = async (id) => {
    if (!window.confirm("Delete video?")) return;

    await deleteDoc(doc(db, "videos", id));
    await loadVideos();
  };
const filteredVideos = videos.filter((series) =>
  (series.seriesName || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

const moveEpisode = (from, to) => {
  if (to < 0 || to >= editEpisodes.length) return;

  const updated = [...editEpisodes];
  const [moved] = updated.splice(from, 1);
  updated.splice(to, 0, moved);

  setEditEpisodes(updated);
};

  /* ================= UPDATE ================= */
  const updateSeries = async () => {
  try {
    if (!editSeriesPanel) return;

    setLoading(true);

    let imageUrl = editSeriesPanel.image;

    // ✅ যদি নতুন image select করা হয়
    if (newSeriesImage) {
      const uploaded = await uploadToCloudinary(
        newSeriesImage,
        "image"
      );

      imageUrl = uploaded.url;
    }

    const snap = await getDocs(collection(db, "videos"));

    const updates = [];

    snap.forEach((item) => {
      const data = item.data();

      if (data.series === editSeriesPanel.seriesName) {
        updates.push(
          updateDoc(doc(db, "videos", item.id), {
            series: newSeriesTitle || editSeriesPanel.seriesName,
            image: imageUrl, // ✅ updated thumbnail
          })
        );
      }
    });

    await Promise.all(updates);

    alert("Series Thumbnail Updated Successfully");

    setEditSeriesPanel(null);
    setNewSeriesImage(null);
    setNewSeriesTitle("");

    await loadVideos();
  } catch (err) {
    console.log(err);
    alert("Update Failed");
  } finally {
    setLoading(false);
  }
};


  const saveSeriesUpdate = async () => {
  try {
    setLoading(true);

    let imageUrl = null;

    // New thumbnail upload
    if (newSeriesImage) {
      const uploaded = await uploadToCloudinary(
        newSeriesImage,
        "image"
      );

      imageUrl = uploaded.url;
    }

    for (let i = 0; i < editEpisodes.length; i++) {
      const ep = editEpisodes[i];

      const updateData = {
        title: ep.title,
        series: editSeriesName,
        episode: i + 1,
        order: i + 1,
        premium: ep.premium || false,
      };

      // thumbnail selected হলে সব episode এ update হবে
      if (imageUrl) {
        updateData.image = imageUrl;
      }

      await updateDoc(
        doc(db, "videos", ep.id),
        updateData
      );
    }

    alert("Series Saved Successfully");

    setNewSeriesImage(null);
    setEditMode(null);

    await loadVideos();
  } catch (err) {
    console.log(err);
    alert("Save Failed");
  } finally {
    setLoading(false);
  }
};

const deleteSeries = async (seriesName) => {
  if (
    !window.confirm(
      `Delete entire series "${seriesName}"?`
    )
  )
    return;

  try {
    const snap = await getDocs(
      collection(db, "videos")
    );

    const promises = [];

    snap.forEach((item) => {
      const data = item.data();

      if (data.series === seriesName) {
        promises.push(
          deleteDoc(doc(db, "videos", item.id))
        );
      }
    });

    await Promise.all(promises);

    alert("Series Deleted");

    loadVideos();
  } catch (err) {
    console.log(err);
  }
};
  

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-black text-red-600 mb-6">
        DARKCITY ADMIN
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        <div className="bg-red-600 p-4 rounded-xl">Videos: {videos.length}</div>
        <div className="bg-blue-600 p-4 rounded-xl">Visitors: {todayVisitors}</div>
        <div className="bg-green-600 p-4 rounded-xl">Users: {totalUsers}</div>
        <div className="bg-yellow-500 text-black p-4 rounded-xl">Premium: {premiumUsers}</div>
        <div className="bg-purple-600 p-4 rounded-xl">Views: {totalViews}</div>
      </div>


      {/* UPLOAD */}
      <div className="bg-zinc-900 p-4 md:p-5 rounded-xl mb-10 flex flex-col gap-3">
        <input
          className="w-full p-3 bg-black rounded"
          placeholder="Series Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          multiple
          onChange={(e) => setImageFiles([...e.target.files])}
        />

        <input
          type="file"
          multiple
          onChange={(e) => setVideoFiles([...e.target.files])}
        />

        <label>
          <input
            type="checkbox"
            checked={premium}
            onChange={(e) => setPremium(e.target.checked)}
          />
          Premium
        </label>

        <button
          onClick={handleUpload}
          className="bg-red-600 px-5 py-3 mt-3"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Series..."
          className="w-full p-3 rounded-xl bg-black border border-gray-700"
        />
      </div>

      {/* SERIES GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredVideos.map((series) => (
          <div
            key={series.seriesName}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.02] transition w-full"
          >
            {/* POSTER */}
            <img src={series.image} className="w-full h-48 sm:h-56 md:h-64 object-cover" />

            {/* INFO */}
            <div className="p-4">
              <h3 className="font-bold text-lg">{series.seriesName}</h3>

              <p className="text-gray-400 text-sm mb-3">
                {series.episodes.length} Episodes
              </p>

              <div className="flex gap-2">

  <button
    onClick={() => {
      setEditMode(series.seriesName);
      setEditSeriesName(series.seriesName);
      setEditEpisodes(series.episodes);
    }}
    className="flex-1 bg-blue-600 py-2 rounded-xl"
  >
    Manage
  </button>

  <button
    onClick={() =>
      deleteSeries(series.seriesName)
    }
    className="bg-red-600 px-4 rounded-xl"
  >
    🗑
  </button>

</div>
            </div>

            {/* EPISODES PANEL */}
            {editMode === series.seriesName && (
              <div className="bg-black/40 p-3 max-h-[300px] overflow-y-auto">
                {series.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex flex-col sm:flex-row sm:justify-between gap-2 items-start sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-bold">{ep.title}</p>
                      <p className="text-xs text-gray-400">Episode {ep.episode}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
  setSelectedEpisodeId(ep.id);
  setEditingVideo(ep);
  setEditTitle(ep.title);
  setEditSeries(ep.series);
  setEditEpisode(ep.episode);
  setEditPremium(ep.premium);
}}
                        className="flex flex-wrap gap-2">

                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {editMode && (
        <div className="fixed inset-0 bg-black/95 p-3 sm:p-6 overflow-y-auto z-50">
          <h1 className="text-2xl font-bold mb-4">Edit Series: {editSeriesName}</h1>

          {/* SERIES NAME */}
          <input
            value={editSeriesName}
            onChange={(e) => setEditSeriesName(e.target.value)}
            className="w-full p-3 bg-black border mb-4"
            placeholder="Series Name"
          />
          <div className="grid grid-cols-1 gap-3 mt-3">

  <div className="bg-zinc-900 p-3 rounded-xl">
    <p className="text-xs text-gray-400 mb-2">
      Thumbnail
    </p>

    <input
  type="file"
  accept="image/*"
  className="w-full text-sm"
  onChange={(e) => setNewSeriesImage(e.target.files[0])}
/>
  </div>
          <button
            onClick={() => setEditMode(null)}
            className="bg-red-600 px-4 py-2 rounded-xl"
          >
            Close
          </button>

          {/* EPISODES DRAG LIST */}
          <div className="space-y-3">
            {editEpisodes.map((ep, index) => (
              <div
                key={ep.id}
                className="
bg-white/5
border border-white/10
rounded-2xl
p-4
space-y-4
">
                <div>
                  <input
  value={ep.title}
  onChange={(e) => {
    const updated = [...editEpisodes];
    updated[index].title = e.target.value;
    setEditEpisodes(updated);
  }}
  className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-xl text-sm"
/>
                  <p className="text-xs text-gray-400">Episode {index + 1}</p>
                </div>
                {/* THUMBNAIL CHANGE */}
<div className="grid grid-cols-1 gap-3 mt-3">

  <div className="bg-zinc-900 p-3 rounded-xl">
    <p className="text-xs text-gray-400 mb-2">
      Thumbnail
    </p>

    <input
      type="file"
      accept="image/*"
      className="w-full text-sm"
    />
  </div>

  <div className="bg-zinc-900 p-3 rounded-xl">
    <p className="text-xs text-gray-400 mb-2">
      Video
    </p>

    <input
      type="file"
      accept="video/*"
      className="w-full text-sm"
    />
  </div>

</div>

                <div className="flex justify-end gap-2">
  <button
    onClick={() => moveEpisode(index, index - 1)}
    className="bg-blue-600 px-4 py-2 rounded-xl"
  >
    ↑ Up
  </button>

  <button
    onClick={() => moveEpisode(index, index + 1)}
    className="bg-blue-600 px-4 py-2 rounded-xl"
  >
    ↓ Down
  </button>

<button
  onClick={async () => {
    if (!window.confirm("Delete this episode?")) return;

    await deleteDoc(doc(db, "videos", ep.id));

    setEditEpisodes(
      editEpisodes.filter((item) => item.id !== ep.id)
    );

    loadVideos();
  }}
  className="bg-red-600 px-4 py-2 rounded-xl"
>
  Delete
</button>

</div>
              </div>
            ))}
          </div>
        </div>

          


          {/* SAVE BUTTON */}
          <button
  onClick={saveSeriesUpdate}
  className="bg-green-600 px-6 py-3 rounded-xl mt-5"
>
  {loading ? "Saving..." : "Save Full"}
</button>
  

          <button
            onClick={() => setEditMode(null)}
            className="bg-red-600 px-6 py-3 rounded-xl mt-3 ml-3"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
