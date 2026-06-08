import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "./firebase/firebase-config";
import { signOut } from "firebase/auth";

export default function Navbar({ search, setSearch }) {
  const location = useLocation();
  const navigate = useNavigate();

  const showSearch =
    location.pathname === "/" ||
    location.pathname === "/all-videos";

  return (
    <div className="backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">

        <Link to="/">
          <h1 className="text-2xl md:text-4xl font-black text-red-600">
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

        <button
          onClick={() => navigate("/all-videos")}
          className="bg-red-600 px-4 py-2 rounded m-4"
        >
          Videos
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