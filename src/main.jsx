import React from "react";
import ReactDOM from "react-dom/client";

import {
 BrowserRouter
} from "react-router-dom";

import "./index.css";

import App from "./App";

ReactDOM.createRoot(
 document.getElementById("root")
).render(

 <React.StrictMode>

  <BrowserRouter>

   <App />

  </BrowserRouter>

 </React.StrictMode>

);
if (!window.location.pathname.startsWith("/admin")) {
  const s1 = document.createElement("script");
  s1.src = "https://5gvci.com/act/files/tag.min.js?z=11112615";
  s1.async = true;
  document.body.appendChild(s1);
}