import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth ,db } from "./firebase/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";


export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
  auth,
  email,
  password
);

const uid = userCredential.user.uid;

// Firestore user check
const userRef = doc(db, "users", uid);
const userSnap = await getDoc(userRef);

if (userSnap.exists()) {
  const data = userSnap.data();

  // VIP expired?
  if (
    data.premium &&
    data.premiumExpire &&
    data.premiumExpire < Date.now()
  ) {
    await updateDoc(userRef, {
      premium: false
    });
  }
}

console.log("Login Success:", userCredential.user);

window.location.href = "/admin";
      console.log("Login UID:", userCredential.user.uid);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-xl">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Admin Login
        </h2>

        <input
          className="w-full mb-4 p-3 rounded-lg bg-[#1c1c1c] text-white outline-none border border-gray-700 focus:border-blue-500"
          placeholder="Admin Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-6 p-3 rounded-lg bg-[#1c1c1c] text-white outline-none border border-gray-700 focus:border-blue-500"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}