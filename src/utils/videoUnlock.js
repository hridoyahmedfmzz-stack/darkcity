import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase-config";

export async function isVideoUnlocked(uid, videoId) {
  try {
    const unlockId = `${uid}_${videoId}`;

    const snap = await getDoc(
      doc(db, "videoUnlocks", unlockId)
    );

    if (!snap.exists()) return false;

    const data = snap.data();

    const expiresAt = data.expiresAt?.toDate?.();

    if (!expiresAt) return false;

    return expiresAt > new Date();
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function unlockVideo(uid, videoId) {
  try {
    const unlockId = `${uid}_${videoId}`;

    const expiresAt = new Date();

    expiresAt.setHours(expiresAt.getHours() + 24);

    await setDoc(
      doc(db, "videoUnlocks", unlockId),
      {
        uid,
        videoId,
        unlockedAt: serverTimestamp(),
        expiresAt,
      }
    );

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}