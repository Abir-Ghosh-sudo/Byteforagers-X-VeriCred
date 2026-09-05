import { createContext,useContext,useState } from "react";
const C=createContext(null);
export function CertificateProvider({children}){ const [certificates,setCertificates]=useState(()=>{try{return JSON.parse(localStorage.getItem("vericred.certificates")||"[]")}catch{return []}}); const save=(list)=>{setCertificates(list);localStorage.setItem("vericred.certificates",JSON.stringify(list))}; const add=(c)=>save([c,...certificates.filter(x=>String(x.tokenId)!==String(c.tokenId))]); return <C.Provider value={{certificates,add}}>{children}</C.Provider> }
export const useCertificateContext=()=>useContext(C);
