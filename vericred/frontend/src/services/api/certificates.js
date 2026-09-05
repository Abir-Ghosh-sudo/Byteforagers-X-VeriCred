import { api } from "./client";
export const prepareCertificate=(data)=>api("/api/certificates/",{method:"POST",body:JSON.stringify(data)});
export const getCertificateApi=(tokenId)=>api(`/api/certificates/${tokenId}`);
export const getOwnerApi=(tokenId)=>api(`/api/certificates/${tokenId}/owner`);
