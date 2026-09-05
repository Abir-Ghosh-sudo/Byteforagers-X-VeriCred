import { getCertificateApi } from "../api/certificates";
import { getReadContract } from "../blockchain/contract";
import { ipfsToHttp } from "../../utils/ipfs";
import { DEFAULT_CERTIFICATE } from "../../utils/constants";

function getStoredCertificate(tokenId) {
  try {
    const customName = localStorage.getItem(`vericred.cert_name.${tokenId}`);
    const localCerts = JSON.parse(localStorage.getItem("vericred.certificates") || "[]");
    const found = localCerts.find((c) => String(c.tokenId) === String(tokenId));
    return {
      ...(found || {}),
      ...(customName ? { name: customName } : {}),
    };
  } catch {
    return {};
  }
}

export async function getCertificate(tokenId) {
  const tid = String(tokenId || "").trim();
  const stored = getStoredCertificate(tid);

  let data = null;
  try {
    const apiRes = await getCertificateApi(tid);
    if (apiRes) {
      data = {
        tokenId: String(apiRes.token_id ?? apiRes.tokenId ?? tid),
        recipient: apiRes.recipient,
        issuer: apiRes.issuer,
        metadataCID: apiRes.metadata_cid ?? apiRes.metadataCID,
        issuedAt: apiRes.issued_at
          ? new Date(Number(apiRes.issued_at) * 1000).toISOString()
          : new Date().toISOString(),
        revoked: Boolean(apiRes.revoked),
        status: apiRes.revoked ? "Revoked" : "Valid",
      };
    }
  } catch (apiError) {
    console.warn("API unavailable, fetching certificate directly from blockchain:", apiError);
  }

  if (!data) {
    try {
      const contract = getReadContract();
      const cert = await contract.getCertificate(tid);
      const metadataCID = cert.metadataCID || cert[3];

      let metadata = {};
      if (metadataCID && (metadataCID.startsWith("Qm") || metadataCID.startsWith("ba"))) {
        try {
          const res = await fetch(ipfsToHttp(metadataCID));
          if (res.ok) metadata = await res.json();
        } catch {
          // IPFS gateway slow/blocked
        }
      }

      data = {
        tokenId: String(cert.tokenId || cert[0] || tid),
        recipient: String(cert.recipient || cert[1]),
        issuer: String(cert.issuer || cert[2]),
        metadataCID: String(metadataCID || ""),
        issuedAt: new Date(Number(cert.issuedAt || cert[4]) * 1000).toISOString(),
        revoked: Boolean(cert.revoked || cert[5]),
        status: (cert.revoked || cert[5]) ? "Revoked" : "Valid",
        ...metadata,
      };
    } catch {
      data = {
        tokenId: tid,
      };
    }
  }

  return {
    ...DEFAULT_CERTIFICATE,
    ...stored,
    ...data,
    name: stored.name || data.name || DEFAULT_CERTIFICATE.name,
    tokenId: tid,
  };
}

