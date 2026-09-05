import { api } from "./client";
export const verifyCertificateApi=(tokenId)=>api(`/api/verify/${tokenId}`);
export const verifyWalletApi=(address)=>api(`/api/verify/wallet/${address}`);
