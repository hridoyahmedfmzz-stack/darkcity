import { useEffect, useState } from "react";
import { db } from "./firebase/firebase-config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminControl() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const snap = await getDocs(collection(db, "users"));

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setAdmins(list);
    };

    fetchAdmins();
  }, []);
  

  const makeAdmin = async (id) => {
    await updateDoc(doc(db, "users", id), {
      role: "admin",
    });
  };

  const removeAdmin = async (id) => {
    await updateDoc(doc(db, "users", id), {
      role: "user",
    });
  };
  

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Super Admin Control Panel
      </h1>

      <div className="grid gap-4">
        {admins.map((user) => (
          <div key={user.id} className="bg-white/5 p-4 rounded-xl flex justify-between">

            <div>
              <h2 className="font-bold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-green-400">Role: {user.role}</p>
            </div>

            <div className="flex gap-2">
              {user.role !== "superadmin" && (
                <>
                  <button
                    onClick={() => makeAdmin(user.id)}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Make Admin
                  </button>

                  <button
                    onClick={() => removeAdmin(user.id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}