import { getWriteContract } from "./contract";
export async function mintCertificate(signer, recipient, metadataCID){ const c=getWriteContract(signer); const tx=await c.mintCertificate(recipient, metadataCID); const receipt=await tx.wait(); let tokenId=null; for(const log of receipt.logs){ try { const parsed=c.interface.parseLog(log); if(parsed?.name==="CertificateIssued") tokenId=parsed.args.tokenId.toString(); } catch {} } return {txHash:receipt.hash, tokenId}; }
export async function addIssuer(signer,address){ const tx=await getWriteContract(signer).addIssuer(address); return tx.wait(); }
export async function removeIssuer(signer,address){ const tx=await getWriteContract(signer).removeIssuer(address); return tx.wait(); }
export async function revokeCertificate(signer,tokenId){ const tx=await getWriteContract(signer).revokeCertificate(tokenId); return tx.wait(); }
