import { api } from "./client";
export const getIssuers=()=>api("/api/issuers/");
export const getIssuer=(address)=>api(`/api/issuers/${address}`);
export const prepareIssuer=(data)=>api("/api/issuers/",{method:"POST",body:JSON.stringify(data)});
export const adminAddIssuer=(address)=>api(`/api/admin/issuers/${address}`,{method:"POST"});
export const adminRemoveIssuer=(address)=>api(`/api/admin/issuers/${address}`,{method:"DELETE"});
