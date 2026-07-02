import {
  doc,
  getDoc,
  updateDoc,
  increment,
  setDoc
} from "firebase/firestore";

import { db } from "../firebase/firebase-config";

export async function getUserCoins(uid) {
  const ref = doc(db, "users", uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      coins: 0,
      premium: false,
      lastDailyClaim: 0
    });

    return 0;
  }

  return snap.data().coins || 0;
}

export async function addCoins(uid, amount) {

  await setDoc(
    doc(db, "users", uid),
    {
      coins: increment(amount)
    },
    {
      merge: true
    }
  );
}

export async function spendCoins(uid, amount) {
  const snap = await getDoc(
    doc(db, "users", uid)
  );

  if (!snap.exists()) return false;

  const coins = snap.data().coins || 0;

  if (coins < amount) {
    return false;
  }

  await updateDoc(
    doc(db, "users", uid),
    {
      coins: increment(-amount)
    }
  );

  return true;
}