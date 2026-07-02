import { useEffect, useState } from "react";
import { auth, db, storage } from "./firebase/firebase-config";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { updateDoc } from "firebase/firestore";
import { uploadProfileImage } from "./cloudinary";

export default function Profile() {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
const [photo, setPhoto] = useState(null);
const [preview, setPreview] = useState("");
const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

 useEffect(() => {

  const user = auth.currentUser;

  if (!user) {
    setLoading(false);
    return;
  }

  const unsubscribe = onSnapshot(
    doc(db, "users", user.uid),
    (snap) => {

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      setUserData({
        ...snap.data(),
        email: user.email,
        name: user.displayName || snap.data().displayName || "DARKCITY User",
        created: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime
      });

      setName(user.displayName || snap.data().displayName || "");
      setPreview(snap.data().photoURL || "");

      setLoading(false);

    },
    console.error
  );

  return () => unsubscribe();

}, []);

 const saveProfile = async () => {

  try {

    setSaving(true);

    const user = auth.currentUser;

    if (!user) return;

    let photoURL = userData?.photoURL || "";

if (photo) {
  photoURL = await uploadProfileImage(photo);
}
    await updateProfile(user, {
  displayName: name,
  photoURL: photoURL,
});

   await updateDoc(
  doc(db, "users", user.uid),
  {
    displayName: name,
    photoURL: photoURL,
  }
);

setPreview(photoURL);

setUserData((prev) => ({
  ...prev,
  displayName: name,
  name: name,
  photoURL: photoURL,
}));

    alert("Profile Updated");

  } catch(err){

    console.error(err);

    alert(err.message);

  } finally{

    setSaving(false);

  }

};

  if (loading)
    return (
      <div className="text-center p-10">
        Loading...
      </div>
    );
  if (!userData) {

   return (

      <div className="text-center p-10">

         User Not Found

      </div>

   );

}

  const vip =
    userData?.premium &&
    userData?.premiumExpire > Date.now();

  const daysLeft = vip
    ? Math.ceil(
        (userData.premiumExpire -
          Date.now()) /
          86400000
      )
    : 0;

    return (
  <div className="min-h-screen bg-gradient-to-br from-[#090909] via-[#111827] to-black py-10 px-4">

    <div className="max-w-md mx-auto rounded-3xl overflow-hidden bg-[#181818] shadow-2xl border border-zinc-700">

      {/* Header */}
      <div className="h-36 bg-gradient-to-r from-red-600 via-pink-600 to-purple-700"></div>

      {/* Avatar */}
      <div className="-mt-16 flex justify-center">

  <label className="cursor-pointer">

    {preview ? (

      <img
        src={preview}
        alt=""
        className="
        w-32
        h-32
        rounded-full
        object-cover
        border-4
        border-[#181818]
        "
      />

    ) : (

      <div
        className="
        w-32
        h-32
        rounded-full
        bg-zinc-800
        flex
        items-center
        justify-center
        text-6xl
        "
      >
        👤
      </div>

    )}

    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {

        const file =
          e.target.files[0];

        if (!file) return;

        setPhoto(file);

        setPreview(
          URL.createObjectURL(
            file
          )
        );

      }}
    />

  </label>

</div>

      {/* Logo */}
      <div className="text-center mt-3">
       

        <h1 className="text-3xl font-black tracking-widest text-white">
          DARKCITY
        </h1>

        <p className="text-gray-400">
          Premium Entertainment
        </p>
      </div>

      {/* Name */}
      <div className="text-center mt-5">

        <h2 className="text-2xl font-bold text-white">
          {userData.name}
        </h2>

        <p className="text-gray-400">
          {userData.email}
        </p>

        <div className="px-5 mt-5">

  <input
    value={name}
    onChange={(e)=>
      setName(
        e.target.value
      )
    }
    placeholder="Name"
    className="
    w-full
    bg-zinc-900
    border
    border-zinc-700
    p-3
    rounded-xl
    "
  />

</div>

      </div>

      {/* Coin */}
      <div className="p-5">

        <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-5 text-center shadow-xl">

          <div className="text-5xl">
            🪙
          </div>

          <div className="text-4xl font-black mt-2">
            {userData.coins || 0}
          </div>

          <div className="font-semibold">
            Total Coins
          </div>

        </div>

      </div>

      {/* VIP */}
      <div className="px-5">

        {vip ? (

          <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-center text-black font-bold animate-pulse shadow-xl">

            ⭐ VIP MEMBER

            <br />

            ⏳ {daysLeft} Days Left

          </div>

        ) : (

          <div className="rounded-2xl bg-zinc-800 p-4 text-center text-gray-300">

            Free User

          </div>

        )}

      </div>

      {/* Details */}

      <div className="p-5 space-y-3">

        <Info
          title="VIP Expire"
          value={
            vip
              ? new Date(
                  userData.premiumExpire
                ).toLocaleString()
              : "-"
          }
        />

        <Info
          title="Account Created"
          value={userData.created}
        />

        <Info
          title="Last Login"
          value={userData.lastLogin}
        />

      </div>

      <button
  onClick={saveProfile}
  disabled={saving}
  className="
  mx-5
  mb-4
  w-[calc(100%-40px)]
  bg-green-600
  py-3
  rounded-xl
  font-bold
  "
>

  {saving
    ? "Saving..."
    : "💾 Save Profile"}

</button>

      {/* Logout */}

      <div className="p-5">

        <button
          onClick={async () => {
            await signOut(auth);
            navigate("/login");
          }}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition"
        >

          Logout

        </button>

      </div>

    </div>

  </div>
);
}

function Info({ title, value }) {

  return (

    <div className="bg-zinc-900 rounded-xl p-4 flex justify-between border border-zinc-700">

      <span className="text-gray-400">
        {title}
      </span>

      <span className="text-white font-semibold">
        {value}
      </span>

    </div>

  );

}
