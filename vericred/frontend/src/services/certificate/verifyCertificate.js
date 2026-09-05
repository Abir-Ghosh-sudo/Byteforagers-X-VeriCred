import { verifyCertificateApi } from "../api/verification";
import { getReadContract } from "../blockchain/contract";
import { getFallbackProviders } from "../blockchain/provider";
import { contractConfig } from "../../contracts/contractConfig";
import { ethers } from "ethers";
import { ipfsToHttp } from "../../utils/ipfs";
import { DEFAULT_CERTIFICATE } from "../../utils/constants";

function getStoredCertificateData(tokenId) {
  try {
    const customName = localStorage.getItem(`vericred.cert_name.${tokenId}`);
    const localCerts = JSON.parse(localStorage.getItem("vericred.certificates") || "[]");
    const found = localCerts.find((c) => String(c.tokenId) === String(tokenId));
    return {
      name: customName || found?.name || DEFAULT_CERTIFICATE.name,
      course: found?.course || DEFAULT_CERTIFICATE.course,
      institution: found?.institution || DEFAULT_CERTIFICATE.institution,
      description: found?.description || "",
    };
  } catch {
    return {
      name: DEFAULT_CERTIFICATE.name,
      course: DEFAULT_CERTIFICATE.course,
      institution: DEFAULT_CERTIFICATE.institution,
    };
  }
}

export async function verifyCertificate(tokenId) {
  const tid = String(tokenId || "").trim();
  if (!tid) throw new Error("Please enter a valid Certificate Token ID");

  const stored = getStoredCertificateData(tid);
  let verifiedData = null;

  // 1. Try Backend API
  try {
    const apiRes = await verifyCertificateApi(tid);
    if (apiRes) {
      verifiedData = {
        valid: Boolean(apiRes.valid),
        tokenId: String(apiRes.token_id ?? apiRes.tokenId ?? tid),
        recipient: apiRes.recipient,
        issuer: apiRes.issuer,
        metadataCID: apiRes.metadata_cid ?? apiRes.metadataCID ?? "",
        issuedAt: apiRes.issued_at
          ? new Date(Number(apiRes.issued_at) * 1000).toISOString()
          : new Date().toISOString(),
        revoked: Boolean(apiRes.revoked),
        message: apiRes.message || (apiRes.valid ? "Certificate is valid." : "Certificate has been revoked."),
      };
    }
  } catch (apiError) {
    console.warn("Backend API unavailable, querying Sepolia blockchain directly:", apiError.message);
  }

  // 2. If backend didn't return, query on-chain via Sepolia RPCs
  if (!verifiedData) {
    let lastErr = null;
    const providers = getFallbackProviders();

    for (const provider of providers) {
      try {
        const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, provider);
        const res = await contract.verifyCertificate(tid);
        const [valid, recipient, issuer, metadataCID, issuedAt, revoked] = res;

        verifiedData = {
          valid: Boolean(valid),
          tokenId: tid,
          recipient: String(recipient),
          issuer: String(issuer),
          metadataCID: String(metadataCID || ""),
          issuedAt: new Date(Number(issuedAt) * 1000).toISOString(),
          revoked: Boolean(revoked),
          message: valid ? "Certificate is valid." : "Certificate has been revoked.",
        };
        break;
      } catch (err) {
        lastErr = err;
        const msg = String(err?.message || "");
        if (msg.includes("Certificate does not exist") || msg.includes("revert")) {
          throw new Error(`Certificate #${tid} was not found on the Sepolia blockchain.`);
        }
      }
    }

    if (!verifiedData) {
      if (lastErr?.message?.includes("Certificate does not exist")) {
        throw new Error(`Certificate #${tid} was not found on the Sepolia blockchain.`);
      }
      throw new Error(lastErr?.reason || lastErr?.message || "Failed to verify certificate on-chain. Please check your network connection.");
    }
  }

  // 3. Resolve IPFS Metadata if present
  let ipfsMetadata = {};
  if (verifiedData.metadataCID && verifiedData.metadataCID.startsWith("Qm") || verifiedData.metadataCID.startsWith("ba")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const mRes = await fetch(ipfsToHttp(verifiedData.metadataCID), { signal: controller.signal });
      clearTimeout(timeoutId);
      if (mRes.ok) {
        ipfsMetadata = await mRes.json();
      }
    } catch {
      // IPFS fetch may timeout or be blocked; continue gracefully
    }
  }

  return {
    ...DEFAULT_CERTIFICATE,
    ...stored,
    ...ipfsMetadata,
    ...verifiedData,
    status: verifiedData.valid ? "Valid" : "Revoked",
  };
}

