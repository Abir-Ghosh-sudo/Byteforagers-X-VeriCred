import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import IssuerDashboard from "./pages/IssuerDashboard";
import IssueCertificate from "./pages/IssueCertificate";
import Certificate from "./pages/Certificate";
import Verify from "./pages/Verify";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export default function App(){
 return <div className="app-shell"><Navbar/><main className="main"><Routes>
   <Route path="/" element={<Home/>}/>
   <Route path="/dashboard" element={<IssuerDashboard/>}/>
   <Route path="/issue" element={<IssueCertificate/>}/>
   <Route path="/certificate/:tokenId" element={<Certificate/>}/>
   <Route path="/verify" element={<Verify/>}/>
   <Route path="/verify/:tokenId" element={<Verify/>}/>
   <Route path="/admin" element={<AdminDashboard/>}/>
   <Route path="/issuer" element={<Navigate to="/dashboard" replace/>}/>
   <Route path="*" element={<NotFound/>}/>
 </Routes></main><Footer/></div>
}
