import { useState } from "react";
import {
  addDoc,
  collection
} from "firebase/firestore";

import {
  auth,
  db
} from "./firebase/firebase-config";

export default function PaymentPage() {

  const [trxId,setTrxId] =
    useState("");

  const submitRequest = async () => {

    if(!trxId){
      alert("Enter Transaction ID");
      return;
    }

    await addDoc(
      collection(db,"vipRequests"),
      {
        uid: auth.currentUser.uid,
        trxId,
        amount:100,
        days:30,
        status:"pending",
        createdAt:Date.now()
      }
    );

    alert(
      "VIP Request Submitted"
    );

    setTrxId("");
  };

  return (
    <div className="p-5">

      <h1 className="text-3xl mb-5">
        VIP Payment
      </h1>

      <p>
        bKash Number:
        01XXXXXXXXX
      </p>

      <input
        value={trxId}
        onChange={(e)=>
          setTrxId(e.target.value)
        }
        placeholder="Transaction ID"
        className="border p-3 w-full"
      />

      <button
        onClick={submitRequest}
        className="bg-yellow-500 p-3 mt-3"
      >
        Submit
      </button>

    </div>
  );
}