import { useState } from "react";
import {
  addDoc,
  collection
} from "firebase/firestore";

import {
  db,
  auth
} from "./firebase/firebase-config";

export default function VipPage() {
  const [trxId, setTrxId] = useState("");
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const submitRequest = async () => {
    if (!auth.currentUser) {
      alert("Please login first");
      return;
    }

    if (!trxId.trim()) {
      alert("Enter Transaction ID");
      return;
    }

    try {
      setLoading(true);

      await addDoc(
        collection(db, "vipRequests"),
        {
          uid: auth.currentUser.uid,
          name: auth.currentUser.displayName || "",
          email: auth.currentUser.email || "",
          trxId: trxId.trim(),
          days: Number(days),
          status: "pending",
          createdAt: Date.now()
        }
      );

      alert("VIP Request Submitted Successfully");
      setTrxId("");

    } catch (err) {
      console.error("VIP Error:", err);
      alert(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">

      <div className="max-w-xl mx-auto">

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-black rounded-3xl p-8 shadow-2xl mb-6">

          <h1 className="text-4xl font-black mb-2">
             VIP MEMBERSHIP
          </h1>

          <p className="font-semibold">
            Watch Premium Videos
          </p>

          <p className="font-semibold">
            No Restrictions
          </p>

          <p className="font-semibold">
            Exclusive Content Access
          </p>

        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-4">
            Payment Information
          </h2>

          <div className="bg-zinc-800 rounded-2xl p-4 mb-6">

            <p className="text-gray-400">
              Send Payment To
            </p>

            <p className="text-3xl font-black text-green-500">
              01580548805
            </p>

            <p className="text-sm text-gray-500 mt-2">
              bKash Payment Number
            </p>

          </div>

          <label className="block mb-2">
            VIP Package
          </label>

          <select
            value={days}
            onChange={(e) =>
              setDays(
                Number(e.target.value)
              )
            }
            className="
              w-full
              p-3
              rounded-xl
              bg-black
              border
              border-zinc-700
              mb-5
            "
          >
            <option value={30}>
              30 Days VIP
            </option>

            <option value={90}>
              90 Days VIP
            </option>

            <option value={365}>
              365 Days VIP
            </option>

          </select>

          <label className="block mb-2">
            Transaction ID
          </label>

          <input
            value={trxId}
            onChange={(e) =>
              setTrxId(e.target.value)
            }
            placeholder="Enter bKash TRX ID"
            className="
              w-full
              p-3
              rounded-xl
              bg-black
              border
              border-zinc-700
              mb-5
            "
          />

          <button
            onClick={submitRequest}
            disabled={loading}
            className="
              w-full
              bg-yellow-500
              hover:bg-yellow-400
              text-black
              font-black
              py-4
              rounded-2xl
              transition
            "
          >
            {loading
              ? "Submitting..."
              : "SUBMIT VIP REQUEST"}
          </button>

        </div>

        <div className="bg-zinc-900 rounded-3xl p-6 mt-6 border border-white/10">

          <h3 className="text-xl font-bold mb-3">
            VIP Prices
          </h3>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>30 Days</span>
              <span>৳30</span>
            </div>

            <div className="flex justify-between">
              <span>90 Days</span>
              <span>৳80</span>
            </div>

            <div className="flex justify-between">
              <span>365 Days</span>
              <span>৳300</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );}