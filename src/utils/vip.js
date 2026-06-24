import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

import {
  db
} from "../firebase/firebase-config";

export const isVipUser = (userData) => {
  return (
    userData?.premium &&
    userData?.premiumExpire > Date.now()
  );
};

export const checkVipExpiry = async (uid) => {

  const ref =
    doc(db, "users", uid);

  const snap =
    await getDoc(ref);

  if (!snap.exists()) return;

  const data =
    snap.data();

  if (
    data.premium &&
    data.premiumExpire &&
    data.premiumExpire < Date.now()
  ) {

    await updateDoc(ref, {
      premium: false
    });

  }

};