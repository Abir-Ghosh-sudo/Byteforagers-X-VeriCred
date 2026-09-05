import { api } from "./client";
export const getQr=(tokenId)=>api(`/api/qr/${tokenId}`);
export const createQr=(verification_url,token_id)=>api("/api/qr/",{method:"POST",body:JSON.stringify({verification_url,token_id})});
