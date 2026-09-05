import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw,
  Award,
  Sparkles,
} from "lucide-react";
import useVerification from "../hooks/useVerification";
import CopyButton from "../components/common/CopyButton";
import { formatAddress } from "../utils/formatAddress";
import { formatDate } from "../utils/formatDate";
import { contractAddress } from "../contracts/contractConfig";

const SCAN_STEPS = [
  "CONNECTING TO SEPOLIA RPC NODES...",
  "QUERYING SMART CONTRACT STATE...",
  "VALIDATING SOULBOUND NON-TRANSFERABILITY...",
  "CHECKING AUTHORIZED ISSUER SIGNATURE...",
  "CONFIRMING RECIPIENT WALLET BINDING...",
  "CHECKING ON-CHAIN REVOCATION REGISTRY...",
  "VERIFYING IPFS METADATA INTEGRITY...",
];

export default function Verify() {
  const { tokenId: routeId } = useParams();
  const { result, loading, error, verify, setResult, setError } = useVerification();
  const [inputId, setInputId] = useState(routeId || "");
  const [scanStep, setScanStep] = useState(-1);

  useEffect(() => {
    if (routeId) {
      setInputId(routeId);
      handleVerify(routeId);
    }
  }, [routeId]);

  const handleVerify = useCallback(
    async (id) => {
      const tid = (id !== undefined ? id : inputId).trim();
      if (!tid) return;

      setError("");
      setResult(null);
      setScanStep(0);

      // Animate scan steps with dynamic timing
      for (let i = 0; i < SCAN_STEPS.length; i++) {
        await new Promise((r) => setTimeout(r, 220));
        setScanStep(i);
      }

      try {
        await verify(tid);
      } catch (err) {
        console.error("Verification failed:", err);
      } finally {
        setScanStep(-1);
      }
    },
    [inputId, verify, setError, setResult]
  );

  const valid = result?.valid && !result?.revoked;
  const revoked = result?.revoked;
  const currentTokenId = routeId || inputId || result?.tokenId || "1";

  return (
    <div className="verify-page">
      {/* Header */}
      <div className="verify-header-block">
        <div className="eyebrow-badge">
          <ShieldCheck size={13} className="pulse-icon" /> PUBLIC VERIFICATION PROTOCOL
        </div>
        <h1 className="verify-title">
          Verify a Credential
        </h1>
        <p className="verify-subtitle">
          Don't trust the certificate.<br />
          <span className="gradient-text verify-proof-tag">Verify the cryptographic proof.</span>
        </p>
        <div className="verify-network-indicator">
          <span className="live-ping" />
          <span>Connected to <strong>Ethereum Sepolia</strong></span>
          <span className="mono text-muted">({formatAddress(contractAddress, 6)})</span>
        </div>
      </div>

      {/* Scanner Card */}
      <div className="verify-scanner-wrap">
        <div className="scanner-top-bar">
          <span className="scanner-label">
            ENTER CERTIFICATE TOKEN ID
          </span>
          <div className="scanner-quick-pick">
            <span className="quick-pick-title">Sample:</span>
            <button
              type="button"
              className="chip-btn"
              onClick={() => {
                setInputId("1");
                handleVerify("1");
              }}
            >
              <Sparkles size={11} /> Token #1 (Live On-Chain)
            </button>
          </div>
        </div>

        <div className="demo-input-wrap verify-input-row">
          <div className="input-search-prefix">
            <Search size={18} className="search-icon-dim" />
            <input
              id="verify-token-input"
              className="form-input verify-form-input"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="e.g. 1"
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />
          </div>
          <button
            id="verify-onchain-btn"
            className="btn btn-primary verify-submit-btn"
            onClick={() => handleVerify()}
            disabled={loading || scanStep >= 0 || !inputId.trim()}
          >
            {loading || scanStep >= 0 ? (
              <span className="spinner-wrap">
                <span className="spinner" /> VERIFYING...
              </span>
            ) : (
              <>
                <ShieldCheck size={16} /> VERIFY ON-CHAIN
              </>
            )}
          </button>
        </div>

        {/* Scan steps with live visual progression */}
        {scanStep >= 0 && (
          <div className="verify-steps-container">
            <div className="scan-progress-bar">
              <div
                className="scan-progress-fill"
                style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
              />
            </div>
            <div className="verify-steps">
              {SCAN_STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`verify-step${
                    i < scanStep ? " done" : i === scanStep ? " active" : ""
                  }`}
                >
                  <span className="verify-step-dot" />
                  <span className="verify-step-text">{s}</span>
                  {i < scanStep && <CheckCircle2 size={12} className="check-done" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Graceful Error Display */}
        {error && !result && (
          <div className="verify-error-box">
            <div className="error-icon-circle">
              <XCircle size={22} />
            </div>
            <div className="error-content">
              <strong>Verification Unsuccessful</strong>
              <p>{error}</p>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => {
                  setInputId("1");
                  handleVerify("1");
                }}
                style={{ marginTop: 8 }}
              >
                <RefreshCw size={12} /> Try verifying Token #1 instead
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <div
          className={`verify-result-card ${valid ? "valid" : revoked ? "revoked" : "invalid"}`}
        >
          {/* Status Ring & Header */}
          <div className={`verify-ring-wrap ${valid ? "valid" : revoked ? "revoked" : "invalid"}`}>
            <div className="verify-ring-inner">
              {valid ? <ShieldCheck size={46} /> : revoked ? <AlertTriangle size={46} /> : <XCircle size={46} />}
            </div>
            <div className="pulse-ring" />
          </div>

          <div className="verify-status-banner">
            <span className={`status-pill ${valid ? "valid" : revoked ? "revoked" : "invalid"}`}>
              {valid ? "AUTHENTIC SOULBOUND CREDENTIAL" : revoked ? "REVOKED CREDENTIAL" : "INVALID"}
            </span>
            <h2 className="verify-status-title">
              {valid
                ? "Cryptographically Proven & Verified"
                : revoked
                ? "Credential Has Been Revoked"
                : "Credential Not Verified"}
            </h2>
            <p className="verify-status-subtitle">
              {valid
                ? "This credential exists on the Ethereum Sepolia blockchain, is soulbound to the recipient, and has never been altered."
                : revoked
                ? "This credential was revoked on-chain by the issuing institution."
                : "No valid cryptographic proof found matching this Token ID."}
            </p>
          </div>

          {/* Recipient Quick Banner */}
          {result.name && (
            <div className="verify-recipient-preview">
              <div className="preview-label">RECIPIENT NAME</div>
              <div className="preview-name">{result.name}</div>
              {result.course && <div className="preview-course">{result.course}</div>}
            </div>
          )}

          {/* Comprehensive Cryptographic Proof Grid */}
          <div className="verify-grid-card">
            <div className="verify-grid-field">
              <span className="field-label">Token ID</span>
              <div className="field-value">
                <strong className="mono">#{currentTokenId}</strong>
                <CopyButton text={currentTokenId} label="Token ID" />
              </div>
            </div>

            <div className="verify-grid-field">
              <span className="field-label">Status</span>
              <div className="field-value">
                <span className="status-indicator-tag active">
                  <span className="dot" /> {valid ? "Valid & Active" : revoked ? "Revoked" : "Invalid"}
                </span>
              </div>
            </div>

            <div className="verify-grid-field">
              <span className="field-label">Recipient Wallet (Owner)</span>
              <div className="field-value">
                <strong className="mono">{formatAddress(result.recipient, 8)}</strong>
                <CopyButton text={result.recipient || ""} label="Recipient" />
              </div>
            </div>

            <div className="verify-grid-field">
              <span className="field-label">Authorized Issuer</span>
              <div className="field-value">
                <strong className="mono">{formatAddress(result.issuer, 8)}</strong>
                <CopyButton text={result.issuer || ""} label="Issuer" />
              </div>
            </div>

            <div className="verify-grid-field">
              <span className="field-label">Issue Date</span>
              <div className="field-value">
                <strong>{formatDate(result.issuedAt || result.issued_at)}</strong>
              </div>
            </div>

            <div className="verify-grid-field">
              <span className="field-label">Blockchain Network</span>
              <div className="field-value">
                <strong>Ethereum Sepolia</strong>
                <span className="badge badge-purple" style={{ fontSize: 10, padding: "2px 6px" }}>11155111</span>
              </div>
            </div>

            <div className="verify-grid-field">
              <span className="field-label">Soulbound Protection</span>
              <div className="field-value text-accent">
                <Lock size={12} /> Non-Transferable (ERC-721)
              </div>
            </div>

            {result.metadataCID && (
              <div className="verify-grid-field">
                <span className="field-label">IPFS CID</span>
                <div className="field-value">
                  <span className="mono" style={{ fontSize: 12 }}>{result.metadataCID}</span>
                  <CopyButton text={result.metadataCID} label="CID" />
                </div>
              </div>
            )}

            <div className="verify-grid-field full-width">
              <span className="field-label">Smart Contract</span>
              <div className="field-value">
                <strong className="mono">{contractAddress || "Not configured"}</strong>
                <CopyButton text={contractAddress || ""} label="Contract" />
                {contractAddress && (
                  <a
                    href={`https://sepolia.etherscan.io/token/${contractAddress}?a=${currentTokenId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="etherscan-badge"
                  >
                    View on Etherscan <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="verify-actions-bar">
            <Link className="btn btn-primary btn-lg" to={`/certificate/${currentTokenId}`}>
              <Award size={18} /> View Official Certificate <ArrowRight size={15} />
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setInputId("");
                setResult(null);
              }}
            >
              Verify Another Credential
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
