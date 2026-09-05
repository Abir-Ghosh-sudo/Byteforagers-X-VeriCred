import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Search, ShieldCheck, AlertTriangle, XCircle } from "lucide-react";
import useVerification from "../hooks/useVerification";
import { formatAddress } from "../utils/formatAddress";
import { formatDate } from "../utils/formatDate";
import { contractAddress } from "../contracts/contractConfig";

const SCAN_STEPS = [
  "READING BLOCKCHAIN...",
  "CHECKING ISSUER...",
  "CHECKING OWNERSHIP...",
  "CHECKING REVOCATION...",
  "VALIDATING METADATA...",
];

export default function Verify() {
  const { tokenId: routeId } = useParams();
  const { result, loading, error, verify } = useVerification();
  const [inputId, setInputId] = useState(routeId || "");
  const [scanStep, setScanStep] = useState(-1);

  useEffect(() => {
    if (routeId) handleVerify(routeId);
  }, [routeId]);

  const handleVerify = useCallback(
    async (id) => {
      const tid = id || inputId;
      if (!tid.trim()) return;
      setScanStep(0);
      // Animate scan steps
      for (let i = 0; i < SCAN_STEPS.length; i++) {
        await new Promise((r) => setTimeout(r, 350));
        setScanStep(i);
      }
      try {
        await verify(tid);
      } catch {}
      setScanStep(-1);
    },
    [inputId, verify]
  );

  const valid = result?.valid && !result?.revoked;
  const revoked = result?.revoked;

  return (
    <div className="verify-page">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <span className="eyebrow">PUBLIC VERIFICATION</span>
        <h1 style={{ fontSize: "clamp(32px,5vw,48px)", marginBottom: 12 }}>
          Verify a Credential
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 16, maxWidth: 420, margin: "0 auto" }}>
          Don't trust the certificate.<br />
          <span className="gradient-text" style={{ fontWeight: 600 }}>Verify the proof.</span>
        </p>
      </div>

      {/* Scanner Card */}
      <div className="verify-scanner-wrap">
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <span className="eyebrow" style={{ fontSize: 9, letterSpacing: "0.2em" }}>
            CERTIFICATE ID
          </span>
        </div>
        <div className="demo-input-wrap" style={{ marginBottom: 0 }}>
          <input
            className="form-input"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="Enter Token ID"
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            style={{ borderRadius: 999 }}
          />
          <button
            className="btn btn-primary"
            onClick={() => handleVerify()}
            disabled={loading || scanStep >= 0}
            style={{ borderRadius: 999, minWidth: 160 }}
          >
            {loading || scanStep >= 0 ? (
              <span className="spinner" />
            ) : (
              <>
                <Search size={15} /> VERIFY ON-CHAIN
              </>
            )}
          </button>
        </div>

        {/* Scan steps */}
        {scanStep >= 0 && (
          <div className="verify-steps" style={{ marginTop: 20 }}>
            {SCAN_STEPS.map((s, i) => (
              <div
                key={s}
                className={`verify-step${i < scanStep ? " done" : i === scanStep ? " active" : ""}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <span className="verify-step-dot" />
                {s}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !result && (
          <div className="error-msg" style={{ marginTop: 16 }}>
            <XCircle size={16} /> {error}
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div
          className={`verify-result ${valid ? "valid" : revoked ? "revoked" : "invalid"}`}
        >
          <div className={`verify-ring ${valid ? "valid" : revoked ? "revoked" : "invalid"}`}>
            {valid ? "✓" : revoked ? "⚠" : "✕"}
          </div>
          <h2>
            {valid
              ? "VERIFIED"
              : revoked
              ? "REVOKED"
              : "INVALID CREDENTIAL"}
          </h2>
          <p>
            {valid
              ? "AUTHENTIC CREDENTIAL"
              : revoked
              ? "This credential has been revoked by the issuer."
              : "No valid credential found on-chain."}
          </p>
          <div className="verify-grid">
            <div className="verify-field">
              <span>Recipient</span>
              <strong className="mono">{formatAddress(result.recipient, 8)}</strong>
            </div>
            <div className="verify-field">
              <span>Issuer</span>
              <strong className="mono">{formatAddress(result.issuer, 8)}</strong>
            </div>
            {result.course && (
              <div className="verify-field">
                <span>Course</span>
                <strong>{result.course}</strong>
              </div>
            )}
            <div className="verify-field">
              <span>Issue Date</span>
              <strong>{formatDate(result.issuedAt)}</strong>
            </div>
            <div className="verify-field">
              <span>Token ID</span>
              <strong className="mono">{routeId || inputId}</strong>
            </div>
            <div className="verify-field">
              <span>Network</span>
              <strong>Sepolia</strong>
            </div>
            <div className="verify-field" style={{ gridColumn: "1 / -1" }}>
              <span>Contract</span>
              <strong className="mono">{contractAddress || "Not configured"}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
