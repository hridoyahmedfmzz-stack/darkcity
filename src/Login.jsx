import { useState } from "react";
import AdBanner from "./AdBanner.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase/firebase-config";
import { setDoc, doc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Success");
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  };
  
const handleLogin = async () => {
await setDoc(doc(db, "users", user.uid), {
  name: user.displayName || "Admin",
  email: user.email,
  role: "superadmin" // বা "admin"
});
}
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5">

      <div className="bg-white/10 border border-white/10 p-10 rounded-3xl w-full max-w-md backdrop-blur-xl">

        {/* ONLY LOGO */}
        <h1 className="text-4xl font-black text-red-600 mb-6 text-center">
          DARKCITY
        </h1>

        <AdBanner />

        <h2 className="text-xl text-white mb-6 text-center">
          LOGIN
        </h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-2xl mb-4 bg-white/10 text-white outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-2xl mb-6 bg-white/10 text-white outline-none"
        />

        <button
          onClick={login}
          className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-2xl text-white font-bold"
        >
          Login
        </button>

        <div className="text-center mt-6">
          <button
            onClick={() => (window.location.href = "/register")}
            className="text-red-500"
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
}