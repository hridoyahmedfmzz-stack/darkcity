import { auth } from "./firebase/firebase-config";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

import { db } from "./firebase/firebase-config";
import { addCoins } from "./utils/coins";
import { showRewardAd } from "./utils/adsgram";

export default function DailyReward() {

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
      alert(
        "Already claimed today"
      );
      return;
    }

    await showRewardAd();

    await addCoins(
      user.uid,
      20
    );

    await updateDoc(ref, {
      lastDailyClaim: now
    });

    alert(
      "+20 Coins Added"
    );
  };
  const watchBonusAd = async () => {

  const user =
    auth.currentUser;

  if (!user) return;

  await showRewardAd();

  await addCoins(
    user.uid,
    5
  );

  alert("+5 Coins");
};

  return (
    <button
      onClick={claimReward}
      className="bg-green-600 px-5 py-3 rounded-lg"
    >
      🎁 Daily Reward
    </button>
  );
}
<button
  onClick={watchBonusAd}
  className="bg-yellow-500 px-5 py-3 rounded-lg"
>
  💰 Watch Ad +5 Coins
</button>