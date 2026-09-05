import { useParams, Link } from "react-router-dom";
import { ShieldCheck, ExternalLink, Share2, Download, ArrowRight } from "lucide-react";
import useCertificates from "../hooks/useCertificates";
import CopyButton from "../components/common/CopyButton";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatDate } from "../utils/formatDate";
import { formatAddress } from "../utils/formatAddress";
import { DEFAULT_CERTIFICATE } from "../utils/constants";
import { contractAddress } from "../contracts/contractConfig";

export default function Certificate() {
  const { tokenId } = useParams();
  const { data, loading, error } = useCertificates(tokenId);
  const cert = data || { ...DEFAULT_CERTIFICATE, tokenId };

  if (loading) return <Loader text="Loading certificate..." />;

  return (
    <div className="cert-page">
      {/* Badge */}
      <div className="text-center mb-6">
        <span className="badge badge-green" style={{ fontSize: 11, padding: "6px 14px" }}>
          <ShieldCheck size={12} /> VERIFIED ON-CHAIN
        </span>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Certificate Document */}
      <div className="cert-doc">
        <div className="cert-doc-corner tl" />
        <div className="cert-doc-corner tr" />
        <div className="cert-doc-corner bl" />
        <div className="cert-doc-corner br" />

        <div className="cert-doc-brand">VERICRED</div>
        <div className="cert-doc-title">CERTIFICATE OF ACHIEVEMENT</div>
        <div className="cert-doc-hr" />
        <div className="cert-doc-awarded">Awarded to</div>
        <div className="cert-doc-name">
          {cert.name || "Student Name"}
        </div>
        <div className="cert-doc-for">for successfully completing</div>
        <div className="cert-doc-course">
          {cert.course || "Course / Credential"}
        </div>
        <div className="cert-doc-issued-by">Issued by</div>
        <div className="cert-doc-institution">
          {cert.institution || "Institution"}
        </div>
        <div className="cert-doc-hr" />
        <div className="cert-doc-bottom">
          <div className="cert-doc-id">VC-{String(tokenId).padStart(6, "0")}</div>
          <div className="cert-doc-qr">
            <svg width="50" height="50" viewBox="0 0 30 30">
              <rect width="30" height="30" fill="white" />
              <rect x="3" y="3" width="8" height="8" fill="#222" />
              <rect x="19" y="3" width="8" height="8" fill="#222" />
              <rect x="3" y="19" width="8" height="8" fill="#222" />
              <rect x="5" y="5" width="4" height="4" fill="white" />
              <rect x="21" y="5" width="4" height="4" fill="white" />
              <rect x="5" y="21" width="4" height="4" fill="white" />
              <rect x="13" y="3" width="2" height="2" fill="#222" />
              <rect x="13" y="7" width="2" height="2" fill="#222" />
              <rect x="13" y="13" width="4" height="4" fill="#222" />
            </svg>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
            {formatDate(cert.issuedAt || cert.date)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="cert-actions">
        <Link className="btn btn-primary" to={`/verify/${tokenId}`}>
          <ShieldCheck size={15} /> Verify <ArrowRight size={14} />
        </Link>
        <button className="btn btn-secondary" onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied!");
        }}>
          <Share2 size={14} /> Share
        </button>
        <button className="btn btn-ghost" onClick={() => window.print()}>
          <Download size={14} /> Download PDF
        </button>
      </div>

      {/* Blockchain Proof */}
      <div className="glass glass-c cert-proof-section" style={{ padding: "24px 28px", borderRadius: 20 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={14} style={{ color: "var(--primary)" }} />
          BLOCKCHAIN PROOF
        </h3>
        <div>
          <div className="proof-row">
            <span className="proof-label">Token ID</span>
            <span className="proof-val">
              #{tokenId} <CopyButton text={tokenId} label="Token ID" />
            </span>
          </div>
          <div className="proof-row">
            <span className="proof-label">Issuer</span>
            <span className="proof-val">
              {formatAddress(cert.issuer, 10)}
              <CopyButton text={cert.issuer || ""} label="Issuer" />
            </span>
          </div>
          <div className="proof-row">
            <span className="proof-label">Owner</span>
            <span className="proof-val">
              {formatAddress(cert.recipient, 10)}
              <CopyButton text={cert.recipient || ""} label="Owner" />
            </span>
          </div>
          <div className="proof-row">
            <span className="proof-label">Contract</span>
            <span className="proof-val">
              {formatAddress(contractAddress, 10)}
              <CopyButton text={contractAddress || ""} label="Contract" />
            </span>
          </div>
          <div className="proof-row">
            <span className="proof-label">Network</span>
            <span className="proof-val">Sepolia</span>
          </div>
          {cert.metadataCID && (
            <div className="proof-row">
              <span className="proof-label">IPFS CID</span>
              <span className="proof-val">
                {cert.metadataCID}
                <CopyButton text={cert.metadataCID} label="CID" />
              </span>
            </div>
          )}
          {contractAddress && (
            <div className="proof-row" style={{ borderBottom: "none" }}>
              <span className="proof-label">Explorer</span>
              <span className="proof-val">
                <a
                  href={`https://sepolia.etherscan.io/token/${contractAddress}?a=${tokenId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Etherscan <ExternalLink size={11} />
                </a>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
