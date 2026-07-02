import { auth } from "./firebase/firebase-config";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

import { db } from "./firebase/firebase-config";
import { addCoins } from "./utils/coins";
import { showRewardAd } from "./utils/monetag";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase/firebase-config";

const [loading, setLoading] = useState(false);

const claimReward = async () => {

  const user = auth.currentUser;

  if (!user) {
    alert("Login Required");
    return;
  }

  const ref = doc(db, "users", user.uid);

  const snap = await getDoc(ref);

  const last =
    snap.data()?.lastDailyClaim || 0;

  const now = Date.now();

  if (
    now - last <
    24 * 60 * 60 * 1000
  ) {
    alert("Already claimed today");
    return;
  }

  const watched =
    await showRewardAd();

  if (!watched) {
    alert("Ad not completed");
    return;
  }

  const dailyReward = httpsCallable(
  functions,
  "dailyReward"
);

await dailyReward();

  await updateDoc(ref, {
    lastDailyClaim: now
  });

  alert("+20 Coins Added");
};

const watchBonusAd = async () => {

  const user =
    auth.currentUser;

  if (!user) return;

  const watched =
    await showRewardAd();

  if (!watched) {
    alert("Ad not completed");
    return;
  }

 const rewardAd = httpsCallable(
  functions,
  "rewardAd"
);

await rewardAd();

  const watchBonusAd = async () => {

  const user = auth.currentUser;

  if (!user) {
    alert("Login Required");
    return;
  }

  const watched = await showRewardAd();

  console.log("watched =", watched);

  if (!watched) {
    alert("Ad not completed");
    return;
  }

  try {
    await addCoins(user.uid, 5);

    alert("+5 Coins Added");

  } catch (e) {
    console.error("Firestore Error:", e);
    alert(e.message);
  }
};

  alert("+5 Coins");
};

const now = Date.now();

if (
  user.lastRewardAd &&
  now - user.lastRewardAd < 30000
) {
  alert("Please wait 30 seconds");
  return;
}

await updateDoc(ref,{
   lastRewardAd: Date.now()
});

const DailyReward = () => {
  return (
    <>
      <button
        onClick={claimReward}
        className="bg-green-600 px-5 py-3 rounded-lg"
      >
        🎁 Daily Reward
      </button>
      <button
  disabled={loading}
  onClick={watchBonusAd}
>
  {loading ? "Loading..." : "💰 Watch Ad +5 Coins"}
</button>
    </>
  );
};

export default DailyReward;