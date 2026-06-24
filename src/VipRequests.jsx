import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "./firebase/firebase-config";

import {
  useEffect,
  useState
} from "react";

export default function VipRequests() {

  const [requests,setRequests] =
    useState([]);

  const loadRequests =
  async()=>{

    const snap =
      await getDocs(
        collection(db,"vipRequests")
      );

    const arr=[];

    for(const item of snap.docs){

      const data=item.data();

      const userSnap=
        await getDoc(
          doc(
            db,
            "users",
            data.uid
          )
        );

      arr.push({
        id:item.id,
        ...data,
        user:
          userSnap.exists()
          ? userSnap.data()
          : null
      });
    }

    setRequests(arr);
  };

  useEffect(()=>{
    loadRequests();
  },[]);

  const approve =
  async(req)=>{

    await updateDoc(
      doc(db,"users",req.uid),
      {
        premium:true,
        premiumExpire:
          Date.now() +
          req.days *
          24 *
          60 *
          60 *
          1000
      }
    );

    await updateDoc(
      doc(
        db,
        "vipRequests",
        req.id
      ),
      {
        status:"approved"
      }
    );

    loadRequests();
  };

  const reject =
  async(id)=>{

    await updateDoc(
      doc(
        db,
        "vipRequests",
        id
      ),
      {
        status:"rejected"
      }
    );

    loadRequests();
  };

  return (

    <div className="
    min-h-screen
    bg-black
    text-white
    p-6">

      <h1 className="
      text-4xl
      font-black
      text-yellow-500
      mb-8">

        VIP REQUESTS

      </h1>

      <div className="grid gap-5">

        {requests.map(req=>(

          <div
            key={req.id}
            className="
            bg-zinc-900
            border
            border-zinc-700
            rounded-3xl
            p-6">

            <div className="grid md:grid-cols-2 gap-4">

              <div>

                <p>
                  👤 {req.user?.name || "User"}
                </p>

                <p>
                  📧 {req.email}
                </p>

                <p>
                  🆔 {req.uid}
                </p>

              </div>

              <div>

                <p>
                  💳 TRX:
                  {req.trxId}
                </p>

                <p>
                  ⭐ VIP:
                  {req.days} Days
                </p>

                <p>
                  📅
                  {
                    req.createdAt
                    ? new Date(
                      req.createdAt
                    ).toLocaleString()
                    : "-"
                  }
                </p>

                <p
                  className="
                  text-green-400">

                  Status:
                  {req.status}

                </p>

              </div>

            </div>

            <div className="
            mt-5
            flex
            gap-3">

              <button
                onClick={()=>
                  approve(req)
                }
                className="
                bg-green-600
                px-5
                py-2
                rounded-xl">

                Approve

              </button>

              <button
                onClick={()=>
                  reject(req.id)
                }
                className="
                bg-red-600
                px-5
                py-2
                rounded-xl">

                Reject

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}