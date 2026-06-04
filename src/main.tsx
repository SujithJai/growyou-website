import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const script1 = document.createElement("script");
script1.async = true;
script1.src = "https://www.googletagmanager.com/gtag/js?id=G-95P922MYFB";
document.head.appendChild(script1);

const script2 = document.createElement("script");
script2.innerHTML = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-95P922MYFB');
`;
document.head.appendChild(script2);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
