import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db, auth } from "./firebase/firebase-config";

export default function History() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "watchHistory"),
        where("uid", "==", user.uid)
      );

      const snap = await getDocs(q);

      const arr = [];

      snap.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      arr.sort(
        (a, b) =>
          (b.updatedAt || 0) -
          (a.updatedAt || 0)
      );

      setVideos(arr);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading History...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">

      <h1 className="text-3xl font-bold mb-6">
         Continue Watching
      </h1>
      

      {videos.length === 0 ? (
        <div className="text-center text-gray-400">
          No watch history found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {videos.map((video) => (
            <div
              key={video.videoId}
              onClick={() =>
                navigate(
                  `/watch/${video.videoId}`
                )
              }
              className="
                bg-white/5
                rounded-xl
                overflow-hidden
                cursor-pointer
                hover:scale-105
                transition
              "
            >
              <img
                src={
                  video.image ||
                  "https://placehold.co/400x225"
                }
                alt={video.title}
                className="
                  w-full
                  h-40
                  object-cover
                "
              />

              <div className="p-3">

                <h3 className="font-bold line-clamp-2">
                  {video.title}
                </h3>

                <div className="mt-2">
                  <div className="text-sm">
                    {video.progress || 0}%
                    watched
                  </div>

                  <div className="w-full bg-gray-700 rounded mt-1">
                    <div
                      className="bg-red-600 h-2 rounded"
                      style={{
                        width: `${
                          video.progress || 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}