import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  ExternalLink,
  Share2,
  Download,
  ArrowRight,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Award,
  Lock,
} from "lucide-react";
import useCertificates from "../hooks/useCertificates";
import CopyButton from "../components/common/CopyButton";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatDate } from "../utils/formatDate";
import { formatAddress } from "../utils/formatAddress";
import { DEFAULT_CERTIFICATE } from "../utils/constants";
import { contractAddress } from "../contracts/contractConfig";
import { useCertificateContext } from "../context/CertificateContext";

export default function Certificate() {
  const { tokenId } = useParams();
  const { data, loading, error } = useCertificates(tokenId);
  const certContext = useCertificateContext?.();
  const add = certContext?.add || (() => {});

  const cert = data || { ...DEFAULT_CERTIFICATE, tokenId };

  // Write Name on Certificate State
  const storageKey = `vericred.cert_name.${tokenId}`;
  const [studentName, setStudentName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const initial = saved || cert.name || DEFAULT_CERTIFICATE.name;
    setStudentName(initial);
    setTempName(initial);
  }, [tokenId, cert.name, storageKey]);

  const handleSaveName = (e) => {
    e?.preventDefault();
    const finalName = tempName.trim() || DEFAULT_CERTIFICATE.name;
    setStudentName(finalName);
    localStorage.setItem(storageKey, finalName);
    if (cert) {
      add({ ...cert, name: finalName, tokenId });
    }
    setIsEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleResetName = () => {
    const defaultName = cert.name || DEFAULT_CERTIFICATE.name;
    setStudentName(defaultName);
    setTempName(defaultName);
    localStorage.removeItem(storageKey);
    setIsEditing(false);
  };

  if (loading) return <Loader text="Retrieving soulbound credential from Sepolia..." />;

  return (
    <div className="cert-page">
      {/* Top Banner Status */}
      <div className="cert-top-bar">
        <span className="badge badge-green cert-badge-pill">
          <ShieldCheck size={14} className="pulse-icon" /> VERIFIED ON-CHAIN • SOULBOUND ERC-721
        </span>
        <span className="cert-network-tag">
          <span className="net-dot" /> Sepolia Testnet
        </span>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Interactive 'Write Name on Certificate' Floating Banner */}
      <div className="cert-name-editor-bar no-print">
        <div className="editor-bar-content">
          <div className="editor-bar-info">
            <span className="editor-icon-wrap">
              <Sparkles size={16} />
            </span>
            <div>
              <strong>Recipient Name:</strong>{" "}
              <span className="editor-current-name">{studentName}</span>
            </div>
          </div>
          <button
            className={`btn ${isEditing ? "btn-secondary" : "btn-primary"} btn-sm`}
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
              } else {
                setTempName(studentName);
                setIsEditing(true);
              }
            }}
            id="write-name-btn"
          >
            <Edit3 size={14} /> {isEditing ? "Close Editor" : "Write / Edit Name"}
          </button>
        </div>

        {isEditing && (
          <form className="cert-name-input-row" onSubmit={handleSaveName}>
            <div className="input-with-label">
              <label htmlFor="student-name-input">Type Full Recipient Name:</label>
              <input
                id="student-name-input"
                className="form-input"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="e.g. Abir Ghosh"
                autoFocus
              />
            </div>
            <div className="input-action-buttons">
              <button type="submit" className="btn btn-primary btn-sm">
                <Check size={14} /> Save on Certificate
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleResetName}
                title="Reset to original"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </form>
        )}

        {savedToast && (
          <div className="cert-save-toast">
            <Check size={14} /> Name updated and saved on certificate!
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* LUXURY ROYAL SOULBOUND CERTIFICATE DOCUMENT                   */}
      {/* ============================================================ */}
      <div className="luxury-cert-frame" id="printable-certificate">
        {/* Outer Guilloche Ornament Border */}
        <div className="guilloche-border-outer" />
        <div className="guilloche-border-inner" />

        {/* Vintage Corner Brackets */}
        <div className="cert-corner corner-tl" />
        <div className="cert-corner corner-tr" />
        <div className="cert-corner corner-bl" />
        <div className="cert-corner corner-br" />

        {/* Watermark Crest Background */}
        <div className="cert-watermark-crest">
          <Award size={340} strokeWidth={0.6} />
        </div>

        {/* Certificate Header */}
        <div className="cert-header-block">
          <div className="cert-monogram">
            <div className="monogram-shield">
              <ShieldCheck size={28} />
            </div>
            <div className="monogram-text">
              <span className="brand-title">VERICRED PROTOCOL</span>
              <span className="brand-subtitle">DECENTRALIZED ACADEMIC REGISTRY</span>
            </div>
          </div>

          <div className="cert-meta-stamp">
            <span className="stamp-id">TOKEN #{String(tokenId).padStart(6, "0")}</span>
            <span className="stamp-status">IMMUTABLE SOULBOUND</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="cert-title-section">
          <div className="cert-kicker">✦ CERTIFICATE OF ACADEMIC ACHIEVEMENT ✦</div>
          <h1 className="cert-grand-heading">Certificate of Mastery</h1>
          <div className="cert-gold-ribbon-divider">
            <span className="divider-line" />
            <span className="divider-diamond">◆</span>
            <span className="divider-line" />
          </div>
          <p className="cert-presentation-text">
            This credential is permanently recorded on the Ethereum blockchain and certifies that
          </p>
        </div>

        {/* Recipient Name Display (Clickable to Edit) */}
        <div
          className="cert-recipient-section"
          onClick={() => {
            setTempName(studentName);
            setIsEditing(true);
          }}
          title="Click to edit name"
        >
          <div className="cert-recipient-callout">Awarded To</div>
          <div className="cert-recipient-name-wrap">
            <span className="cert-recipient-name">{studentName}</span>
            <span className="name-edit-hint no-print">
              <Edit3 size={14} /> Click to edit
            </span>
          </div>
          <div className="cert-name-underline" />
        </div>

        {/* Course & Completion Details */}
        <div className="cert-body-section">
          <p className="cert-completion-lead">
            for successfully satisfying all rigorous criteria and demonstrating excellence in
          </p>
          <div className="cert-course-badge">
            <Award size={18} className="course-badge-icon" />
            <span className="cert-course-name">
              {cert.course || "Advanced Blockchain & Smart Contract Engineering"}
            </span>
          </div>
          <div className="cert-institution-block">
            <span className="institution-prefix">Conferred by</span>
            <strong className="institution-name">
              {cert.institution || "VeriCred Global Academy & Decentralized Institute"}
            </strong>
          </div>
        </div>

        {/* Certificate Bottom Authority & Proof Bar */}
        <div className="cert-bottom-grid">
          {/* Left: Authority Signature Block */}
          <div className="cert-signature-box">
            <div className="cert-signature-script">VeriCred Protocol Authority</div>
            <div className="cert-signature-line" />
            <span className="signature-title">Authorized Verifier / Issuer</span>
            <span className="signature-wallet mono">{formatAddress(cert.issuer, 8)}</span>
          </div>

          {/* Center: Embossed Royal Golden Medallion Seal */}
          <div className="cert-gold-seal-wrap">
            <div className="gold-seal-outer">
              <div className="gold-seal-inner">
                <div className="gold-seal-star">★</div>
                <div className="gold-seal-text">SOULBOUND</div>
                <div className="gold-seal-sub">VERIFIED</div>
                <div className="gold-seal-year">2026</div>
              </div>
            </div>
            <div className="seal-ribbon ribbon-left" />
            <div className="seal-ribbon ribbon-right" />
          </div>

          {/* Right: Smart Contract Cryptographic Proof & QR */}
          <div className="cert-qr-proof-box">
            <div className="cert-qr-container">
              {/* High-fidelity Vector QR Code pointing to verification */}
              <svg className="cert-qr-svg" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#ffffff" rx="8" />
                {/* Corner Finder Patterns */}
                <rect x="10" y="10" width="26" height="26" fill="#0f172a" rx="4" />
                <rect x="15" y="15" width="16" height="16" fill="#ffffff" rx="2" />
                <rect x="19" y="19" width="8" height="8" fill="#0ea5e9" />

                <rect x="64" y="10" width="26" height="26" fill="#0f172a" rx="4" />
                <rect x="69" y="15" width="16" height="16" fill="#ffffff" rx="2" />
                <rect x="73" y="19" width="8" height="8" fill="#0ea5e9" />

                <rect x="10" y="64" width="26" height="26" fill="#0f172a" rx="4" />
                <rect x="15" y="69" width="16" height="16" fill="#ffffff" rx="2" />
                <rect x="19" y="73" width="8" height="8" fill="#0ea5e9" />

                {/* Data Matrix Elements */}
                <rect x="42" y="14" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="14" width="6" height="6" fill="#0f172a" />
                <rect x="44" y="24" width="6" height="6" fill="#0f172a" />
                <rect x="44" y="36" width="12" height="6" fill="#0ea5e9" />
                <rect x="14" y="44" width="8" height="6" fill="#0f172a" />
                <rect x="28" y="44" width="6" height="8" fill="#0f172a" />
                <rect x="42" y="48" width="8" height="8" fill="#0f172a" />
                <rect x="56" y="46" width="6" height="6" fill="#0f172a" />
                <rect x="66" y="44" width="8" height="6" fill="#0f172a" />
                <rect x="80" y="44" width="6" height="8" fill="#0f172a" />
                <rect x="44" y="66" width="8" height="6" fill="#0f172a" />
                <rect x="56" y="64" width="6" height="10" fill="#0f172a" />
                <rect x="44" y="78" width="12" height="6" fill="#0ea5e9" />
                <rect x="68" y="72" width="8" height="6" fill="#0f172a" />
                <rect x="82" y="70" width="6" height="8" fill="#0f172a" />
                <rect x="74" y="82" width="14" height="6" fill="#0f172a" />
              </svg>
            </div>
            <div className="cert-proof-meta">
              <span className="proof-scan-callout">SCAN TO VERIFY</span>
              <span className="proof-date">{formatDate(cert.issuedAt || cert.date)}</span>
              <span className="proof-network">SEPOLIA ON-CHAIN</span>
            </div>
          </div>
        </div>

        {/* Security Footline */}
        <div className="cert-security-footer">
          <span className="sec-item">
            <Lock size={10} /> NON-TRANSFERABLE ERC-721
          </span>
          <span className="sec-dot">•</span>
          <span className="sec-item">
            RECIPIENT: <span className="mono">{formatAddress(cert.recipient, 6)}</span>
          </span>
          <span className="sec-dot">•</span>
          <span className="sec-item">
            CONTRACT: <span className="mono">{formatAddress(contractAddress, 6)}</span>
          </span>
          <span className="sec-dot">•</span>
          <span className="sec-item">METADATA CID: {cert.metadataCID ? cert.metadataCID.slice(0, 12) + "..." : "ON-CHAIN"}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="cert-actions no-print">
        <Link className="btn btn-primary" to={`/verify/${tokenId}`}>
          <ShieldCheck size={16} /> Verify On-Chain <ArrowRight size={14} />
        </Link>
        <button
          className="btn btn-secondary"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Official Certificate link copied to clipboard!");
          }}
        >
          <Share2 size={15} /> Share Link
        </button>
        <button className="btn btn-ghost" onClick={() => window.print()}>
          <Download size={15} /> Download / Print PDF
        </button>
      </div>

      {/* Detailed Blockchain Proof Card */}
      <div className="glass glass-c cert-proof-section no-print" style={{ padding: "28px 32px", borderRadius: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: 10, margin: 0, fontSize: 13, letterSpacing: "0.15em", color: "var(--primary)" }}>
            <ShieldCheck size={16} />
            BLOCKCHAIN AUDIT TRAIL
          </h3>
          <span className="badge badge-green" style={{ fontSize: 11 }}>100% IMMUTABLE PROOF</span>
        </div>

        <div className="proof-rows-container">
          <div className="proof-row">
            <span className="proof-label">Token ID</span>
            <span className="proof-val">
              #{tokenId} <CopyButton text={tokenId} label="Token ID" />
            </span>
          </div>
          <div className="proof-row">
            <span className="proof-label">Student / Recipient</span>
            <span className="proof-val">
              <strong style={{ color: "white", marginRight: 8 }}>{studentName}</strong>
              <span className="mono text-muted">({formatAddress(cert.recipient, 8)})</span>
              <CopyButton text={cert.recipient || ""} label="Recipient Wallet" />
            </span>
          </div>
          <div className="proof-row">
            <span className="proof-label">Authorized Issuer</span>
            <span className="proof-val">
              <span className="mono">{formatAddress(cert.issuer, 8)}</span>
              <CopyButton text={cert.issuer || ""} label="Issuer" />
            </span>
          </div>
          <div className="proof-row">
            <span className="proof-label">Soulbound Contract</span>
            <span className="proof-val">
              <span className="mono">{contractAddress || "Not configured"}</span>
              <CopyButton text={contractAddress || ""} label="Contract" />
            </span>
          </div>
          <div className="proof-row">
            <span className="proof-label">Network / Protocol</span>
            <span className="proof-val">Ethereum Sepolia Testnet (Chain ID 11155111)</span>
          </div>
          <div className="proof-row">
            <span className="proof-label">Issuance Timestamp</span>
            <span className="proof-val">{formatDate(cert.issuedAt || cert.date)}</span>
          </div>
          {cert.metadataCID && (
            <div className="proof-row">
              <span className="proof-label">IPFS Metadata CID</span>
              <span className="proof-val mono">
                {cert.metadataCID}
                <CopyButton text={cert.metadataCID} label="CID" />
              </span>
            </div>
          )}
          {contractAddress && (
            <div className="proof-row" style={{ borderBottom: "none" }}>
              <span className="proof-label">Public Block Explorer</span>
              <span className="proof-val">
                <a
                  href={`https://sepolia.etherscan.io/token/${contractAddress}?a=${tokenId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="etherscan-link"
                >
                  Inspect Contract on Sepolia Etherscan <ExternalLink size={12} />
                </a>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
