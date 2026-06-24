import { useEffect, useState } from "react";
import { db } from "./firebase/firebase-config";

import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

export default function AdminControl() {

  const [users,setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    const snap =
      await getDocs(
        collection(db, "users")
      );

    const list = [];

    snap.forEach((item) => {

      list.push({
        id:item.id,
        ...item.data()
      });

    });

    setUsers(list);

  };

  const makeAdmin = async(id)=>{

    await updateDoc(
      doc(db,"users",id),
      {
        role:"admin"
      }
    );

    loadUsers();

  };

  const removeAdmin = async(id)=>{

    await updateDoc(
      doc(db,"users",id),
      {
        role:"user"
      }
    );

    loadUsers();

  };

  const givePremium = async(id)=>{

    await updateDoc(
      doc(db,"users",id),
      {
        premium:true,
        premiumExpire:
          Date.now() +
          30 * 24 * 60 * 60 * 1000
      }
    );

    loadUsers();

  };

  const removePremium = async(id)=>{

    await updateDoc(
      doc(db,"users",id),
      {
        premium:false
      }
    );

    loadUsers();

  };

  const deleteUser = async(id)=>{

    if(
      !window.confirm(
        "Delete User?"
      )
    ) return;

    await deleteDoc(
      doc(db,"users",id)
    );

    loadUsers();

  };

  return (

    <div className="mt-12">

      <h2 className="text-4xl font-black text-red-500 mb-8">
        SUPER ADMIN PANEL
      </h2>

      <div className="grid gap-4">

        {users.map((user)=>(

          <div
            key={user.id}
            className="bg-zinc-900 p-5 rounded-3xl border border-white/10"
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>

                <h3 className="font-bold text-xl">
                  {user.name || "User"}
                </h3>

                <p className="text-gray-400">
                  {user.email}
                </p>

                <p className="text-green-400">
                  Role :
                  {" "}
                  {user.role || "user"}
                </p>

                <p className="text-yellow-400">
                  Premium :
                  {" "}
                  {user.premium
                    ? "Active"
                    : "Inactive"}
                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  onClick={()=>
                    makeAdmin(user.id)
                  }
                  className="bg-blue-600 px-4 py-2 rounded-xl"
                >
                  Make Admin
                </button>

                <button
                  onClick={()=>
                    removeAdmin(user.id)
                  }
                  className="bg-red-600 px-4 py-2 rounded-xl"
                >
                  Remove Admin
                </button>

                <button
                  onClick={()=>
                    givePremium(user.id)
                  }
                  className="bg-yellow-500 text-black px-4 py-2 rounded-xl"
                >
                  Give Premium
                </button>

                <button
                  onClick={()=>
                    removePremium(user.id)
                  }
                  className="bg-orange-500 px-4 py-2 rounded-xl"
                >
                  Remove Premium
                </button>

                <button
                  onClick={()=>
                    deleteUser(user.id)
                  }
                  className="bg-red-800 px-4 py-2 rounded-xl"
                >
                  Delete User
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}