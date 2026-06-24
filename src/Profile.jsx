import {
  useEffect,
  useState
} from "react";

import {
  auth
} from "./firebase/firebase-config";

import {
  getUserCoins
} from "./utils/coins";

export default function Profile() {

  const [coins, setCoins] =
    useState(0);
 const [userData, setUserData] = useState(null);

  useEffect(() => {
  const load = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      setUserData(snap.data());
      setCoins(snap.data().coins || 0);
    }
  };

  load();
}, []);

  return (
    <div className="p-5">

      <h1 className="text-3xl font-bold">

        👤 Profile

      </h1>
      {isVipUser(userData) ? (
  <div className="bg-yellow-500 text-black px-3 py-1 rounded">
    ⭐ VIP MEMBER
  </div>
) : (
  <div className="bg-gray-700 px-3 py-1 rounded">
    Free User
  </div>
)}

      <div className="mt-5 text-xl">

        🪙 Coins: {coins}

      </div>

    </div>
  );
}
