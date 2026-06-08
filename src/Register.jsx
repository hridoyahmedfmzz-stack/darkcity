import { useState } from "react";
import Navbar from "./Navbar";
import AdBanner from "./AdBanner.jsx";

import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

import { auth } from "./firebase/firebase-config";

export default function Register(){

  const [name, setName] = useState("");

 const [email,setEmail] =
 useState("");

 const [password,setPassword] =
 useState("");

 const handleRegister = async () => {
  try {

    const userCredential =
  await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

await updateProfile(
  userCredential.user,
  {
    displayName: name
  }
);

await userCredential.user.reload();

alert("Register Success");

  } catch (error) {
    console.log(error);
  }
};

 return(

  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="bg-white/10 p-10 rounded-3xl w-full max-w-md">
<h1 className="text-4xl font-black text-red-600 mb-6 text-center">
          DARKCITY
        </h1>
      <AdBanner />
      <h1 className="text-4xl font-black text-white mb-8">
        Create Account
      </h1>

<input
  type="text"
  placeholder="Full Name"
  value={name}
  onChange={(e)=>setName(e.target.value)}
  className="w-full p-4 rounded-2xl mb-4 bg-white/10 text-white outline-none"
/>

      <input
       type="email"
       placeholder="Email"
       onChange={(e)=>setEmail(e.target.value)}
       className="w-full p-4 rounded-2xl mb-4 bg-white/10 text-white outline-none"
      />

      <input
       type="password"
       placeholder="Password"
       onChange={(e)=>setPassword(e.target.value)}
       className="w-full p-4 rounded-2xl mb-6 bg-white/10 text-white outline-none"
      />

      <button
       onClick={handleRegister}
       className="w-full bg-red-600 p-4 rounded-2xl text-white font-bold"
      >
        Create Account
      </button>

    </div>

  </div>

 )

}