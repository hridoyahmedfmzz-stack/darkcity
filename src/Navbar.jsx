import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "./firebase/firebase-config";
import { signOut } from "firebase/auth";
import { getUserCoins } from "./utils/coins";
import { isVipUser } from "./utils/vip";

export default function Navbar({ search, setSearch, userData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);

  const showSearch =
    location.pathname === "/" ||
    location.pathname === "/all-videos";
    

useEffect(() => {

  const load = async () => {

    if (!auth.currentUser)
      return;

    setCoins(
      await getUserCoins(
        auth.currentUser.uid
      )
    );
  };

  load();

}, []);

  return (
    <div className="
sticky top-0 z-50
backdrop-blur-xl
bg-black/70
border-b border-red-500/20
shadow-lg
">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">

        <Link to="/">
         <h1 className="
text-4xl
font-black
bg-gradient-to-r
from-red-500
to-pink-500
bg-clip-text
text-transparent
">
DARKCITY
</h1>
        </Link>

        {showSearch && (
          <input
            type="text"
            placeholder="Search Videos..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 bg-white/10 px-4 py-2 rounded-xl outline-none"
          />
        )}
        {isVipUser(userData) && (
  <span className="bg-yellow-500 text-black px-2 py-1 rounded">
     VIP
  </span>
)}
<button
  onClick={() => navigate("/vip")}
  className="
w-full md:w-96
bg-zinc-900/80
border border-zinc-700
px-5 py-3
rounded-2xl
focus:border-red-500
outline-none
"
>
  ⭐ Buy VIP
</button>

        <span className="font-bold">
  🪙 {coins}
</span>

        <button
          onClick={() => navigate("/all-videos")}
          className="bg-red-600 px-4 py-2 rounded m-4"
        >
          Video
        </button>

<button
  onClick={() => navigate("/history")}
  className="bg-red-600 px-4 py-2 rounded-xl"
>
  History
</button>

        {auth.currentUser ? (
          <div className="flex items-center gap-3">
            <p className="font-bold">
              {auth.currentUser.displayName ||
                auth.currentUser.email}
            </p>

            <button
              onClick={() => signOut(auth)}
              className="bg-red-600 px-4 py-2 rounded-xl"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="bg-red-600 px-5 py-2 rounded-xl">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}