import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

export function useRole() {
  const [role, setRole] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setRole("guest");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        setRole(snap.data().role);
      } else {
        setRole("user");
      }
    });

    return () => unsub();
  }, []);

  return role;
}