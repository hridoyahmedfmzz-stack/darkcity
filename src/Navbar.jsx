import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth ,db} from "./firebase/firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getUserCoins } from "./utils/coins";
import { isVipUser } from "./utils/vip";
import { doc, onSnapshot } from "firebase/firestore";

export default function Navbar({ search, setSearch, userData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [user, setUser] = useState(null);

  const showSearch =
    location.pathname === "/" ||
    location.pathname === "/all-videos";
    

useEffect(() => {

  if (!auth.currentUser) return;

  const unsubscribe = onSnapshot(

    doc(db, "users", auth.currentUser.uid),

    (snap) => {

      if (!snap.exists()) return;

      setCoins(snap.data().coins || 0);

    }

  );

  return () => unsubscribe();

}, []);

useEffect(() => {

   const unsub = onAuthStateChanged(auth,(u)=>{

      setUser(u);

   });

   return unsub;

},[]);
user?.displayName
user?.email
user?.photoURL

  return (
    <div className="
sticky top-0 z-50
backdrop-blur-xl
bg-black/70
border-b border-red-500/20
shadow-lg
">
      <div
className="
max-w-[1600px]
mx-auto
px-6
py-3
flex
items-center
justify-between
gap-4
flex-wrap
"
>
        <Link to="/">
        <h1
className="
text-5xl
font-black
tracking-wider
bg-gradient-to-r
from-red-500
via-pink-500
to-purple-500
bg-clip-text
text-transparent
drop-shadow-lg
"
>
DARKCITY
</h1>
        </Link>

        {showSearch && (
          <input
            type="text"
            placeholder="Search Videos..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
           className="
w-full
md:w-[350px]
lg:w-[420px]
bg-zinc-900
border
border-zinc-700
rounded-2xl
px-5
py-3
text-white
placeholder:text-gray-500
focus:border-red-500
outline-none
transition
"
          />
        )}
        {isVipUser(userData) && (
  <span
className="
px-4
py-2
rounded-full
bg-gradient-to-r
from-yellow-400
to-orange-500
text-black
font-bold
animate-pulse
shadow-lg
">

 VIP

</span>
)}
<button
  onClick={() => navigate("/vip")}
  className="
px-8
py-3
rounded-2xl
bg-gradient-to-r
from-yellow-500
to-orange-500
text-black
font-bold
shadow-lg
hover:scale-105
transition
"
>
   Buy VIP
</button>

        <div
          className="
          flex
          items-center
          gap-2
          px-5
          py-3
          rounded-2xl
          bg-yellow-500/10
          border
          border-yellow-400
          text-yellow-300
          font-bold
          shadow-lg
          "
        >
          <span>🪙 {coins}</span>
        </div>

        <button
          onClick={() => navigate("/all-videos")}
          className="
          px-6
          py-3
          rounded-2xl
          bg-red-600
          hover:bg-red-700
          font-semibold
          transition
          shadow-lg
          "
        >
          Video
        </button>

        <button
          onClick={() => navigate("/history")}
          className="
          px-6
          py-3
          rounded-2xl
          bg-red-600
          hover:bg-red-700
          font-semibold
          transition
          shadow-lg
          "
        >
          History
        </button>


<button
  onClick={() => navigate("/profile")}
  className="
  flex
  items-center
  gap-3
  bg-zinc-900
  hover:bg-zinc-800
  border
  border-zinc-700
  rounded-2xl
  px-3
  py-2
  transition
  shadow-lg
"
>
  <img
    src={user?.photoURL || "/avatar.png"}
    alt=""
    className="
    w-12
    h-12
    rounded-full
    object-cover
    border-2
    border-red-500
    flex-shrink-0
    "
  />

  <div className="text-left">
    <h3 className="text-white font-bold leading-5 max-w-[120px] truncate">
      {user?.displayName || "Guest"}
    </h3>

    <p className="text-xs text-gray-400">
      View Profile
    </p>
  </div>
</button>

  {auth.currentUser ? (
    <button
      onClick={() => signOut(auth)}
      className="
px-6
py-3
rounded-2xl
bg-gradient-to-r
from-red-600
to-red-500
hover:scale-105
transition
shadow-lg
font-bold
"
    >
      Logout
    </button>
  ) : (
    <Link to="/login">
      <button className="
px-6
py-3
rounded-2xl
bg-gradient-to-r
from-red-600
to-red-500
hover:scale-105
transition
shadow-lg
font-bold
">
        Login
      </button>
    </Link>
  )}
</div>
      </div>
  );
}