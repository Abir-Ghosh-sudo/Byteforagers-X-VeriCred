import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { WalletProvider } from "./context/WalletContext";
import { CertificateProvider } from "./context/CertificateContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <CertificateProvider>
          <App />
        </CertificateProvider>
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>
);
