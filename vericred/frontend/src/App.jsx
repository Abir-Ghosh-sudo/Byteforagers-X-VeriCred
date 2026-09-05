import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import IssuerDashboard from "./pages/IssuerDashboard";
import IssueCertificate from "./pages/IssueCertificate";
import Certificate from "./pages/Certificate";
import Verify from "./pages/Verify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={<IssuerDashboard />}
        />

        <Route
          path="/issue"
          element={<IssueCertificate />}
        />

        <Route
          path="/certificate/:tokenId"
          element={<Certificate />}
        />

        <Route
          path="/verify"
          element={<Verify />}
        />

        <Route
          path="/verify/:tokenId"
          element={<Verify />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;