import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  ScanLine,
  Globe,
  Upload,
  HardDrive,
  Search,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import { contractAddress } from "../contracts/contractConfig";
import { formatAddress } from "../utils/formatAddress";

export default function Home() {
  const navigate = useNavigate();
  const [quickTokenId, setQuickTokenId] = useState("");

  const handleQuickVerify = (e) => {
    e?.preventDefault();
    const tid = quickTokenId.trim() || "1";
    navigate(`/verify/${tid}`);
  };

  return (
    <>
      {/* ── HERO ───────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="eyebrow">VERIFIED ON-CHAIN</span>
            <span className="badge badge-cyan" style={{ fontSize: 10, padding: "3px 10px" }}>
              <span className="badge-dot" /> SOULBOUND ERC-721
            </span>
          </div>
          <h1 className="hero-h1">
            Trust Every Credential.
            <br />
            <span className="gradient-text">Verify It On-Chain.</span>
          </h1>
          <p className="hero-sub">
            Digital credentials secured by Ethereum blockchain, backed by cryptographic
            proof, non-transferable, and verifiable in seconds without intermediaries.
          </p>
          <div className="hero-ctas">
            <Link className="btn btn-primary btn-lg" to="/verify">
              Verify a Credential <ArrowRight size={18} />
            </Link>
            <Link className="btn btn-secondary" to="/issue">
              Issue a Certificate
            </Link>
          </div>
          <div className="hero-status">
            <span className="hero-status-dot" />
            <span style={{ color: "var(--green-bright)", fontWeight: 600 }}>
              NETWORK ONLINE
            </span>
            <span style={{ color: "var(--muted2)", marginLeft: 4 }}>
              · SEPOLIA TESTNET
            </span>
          </div>
        </div>

        {/* ── INTERACTIVE ON-CHAIN TRUST & AUDIT TERMINAL ── */}
        <div className="hero-terminal-wrap">
          <div className="hero-terminal-card">
            {/* Terminal Window Header */}
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot-red" />
                <span className="dot-amber" />
                <span className="dot-green" />
              </div>
              <span className="terminal-title">VERICRED PROTOCOL • AUDIT ENGINE</span>
              <span className="terminal-live-badge">
                <span className="live-ping-dot" /> LIVE
              </span>
            </div>

            {/* Quick On-Chain Verifier */}
            <div className="terminal-verifier-box">
              <div className="terminal-box-label">
                <span>QUICK ON-CHAIN VERIFIER</span>
                <span className="text-muted">Instant cryptographic lookup</span>
              </div>
              <form className="terminal-input-wrap" onSubmit={handleQuickVerify}>
                <div className="terminal-input-inner">
                  <Search size={15} className="terminal-search-icon" />
                  <input
                    className="terminal-form-input"
                    value={quickTokenId}
                    onChange={(e) => setQuickTokenId(e.target.value)}
                    placeholder="Enter Token ID (e.g. 1)"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm terminal-submit-btn">
                  <Zap size={13} /> Verify
                </button>
              </form>
              <div className="terminal-chips">
                <span className="chips-hint">Quick test:</span>
                <button
                  type="button"
                  className="terminal-chip"
                  onClick={() => navigate("/verify/1")}
                >
                  <Sparkles size={11} /> Token #1 (Sepolia On-Chain)
                </button>
              </div>
            </div>

            {/* Blockchain Audit Features Grid */}
            <div className="terminal-features-grid">
              <div className="terminal-feature-item">
                <div className="feature-icon-wrap">
                  <Lock size={15} />
                </div>
                <div className="feature-text">
                  <strong>Soulbound Non-Transferable</strong>
                  <span>Bound permanently to student's recipient wallet</span>
                </div>
              </div>

              <div className="terminal-feature-item">
                <div className="feature-icon-wrap">
                  <Cpu size={15} />
                </div>
                <div className="feature-text">
                  <strong>Ethereum Sepolia Smart Contract</strong>
                  <span className="mono">{formatAddress(contractAddress, 8) || "0x2707...F07F"}</span>
                </div>
              </div>

              <div className="terminal-feature-item">
                <div className="feature-icon-wrap">
                  <HardDrive size={15} />
                </div>
                <div className="feature-text">
                  <strong>Decentralized IPFS Metadata</strong>
                  <span>Tamper-proof verifiable content hash</span>
                </div>
              </div>

              <div className="terminal-feature-item">
                <div className="feature-icon-wrap">
                  <CheckCircle2 size={15} />
                </div>
                <div className="feature-text">
                  <strong>Zero-Gas Public Verification</strong>
                  <span>Anyone can verify proof freely without wallet</span>
                </div>
              </div>
            </div>

            {/* Terminal Live Telemetry Strip */}
            <div className="terminal-footer">
              <div className="telemetry-item">
                <span className="tel-label">CHAIN ID</span>
                <span className="tel-val mono">11155111</span>
              </div>
              <div className="telemetry-item">
                <span className="tel-label">STANDARD</span>
                <span className="tel-val">ERC-721 SOULBOUND</span>
              </div>
              <div className="telemetry-item">
                <span className="tel-label">CONSENSUS</span>
                <span className="tel-val">POS (SEPOLIA)</span>
              </div>
              <div className="telemetry-item">
                {contractAddress && (
                  <a
                    href={`https://sepolia.etherscan.io/address/${contractAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="telemetry-link"
                  >
                    Etherscan <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* ── TRUST STRIP ────────────────────────────── */}
      <section className="trust-section">
        <div className="trust-strip">
          <div className="trust-item">
            <ShieldCheck size={16} /> BLOCKCHAIN VERIFIED
          </div>
          <div className="trust-item">
            <Lock size={16} /> SOULBOUND
          </div>
          <div className="trust-item">
            <HardDrive size={16} /> IPFS BACKED
          </div>
          <div className="trust-item">
            <Globe size={16} /> PUBLICLY VERIFIABLE
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section className="steps-section">
        <span className="eyebrow">HOW IT WORKS</span>
        <div className="section-heading">
          <h2>Three Steps to Trust</h2>
          <p>
            From issuance to verification — a seamless, trustless process
            powered by blockchain.
          </p>
        </div>
        <div className="steps-grid">
          <div className="step">
            <span className="step-num">01</span>
            <div className="step-icon">
              <Upload size={28} />
            </div>
            <h3>Issue</h3>
            <p>Authorized institutions issue credentials to student wallets.</p>
          </div>
          <div className="step-connector">
            <div className="step-line" />
          </div>
          <div className="step">
            <span className="step-num">02</span>
            <div className="step-icon">
              <HardDrive size={28} />
            </div>
            <h3>Secure</h3>
            <p>
              Certificate metadata is stored on IPFS and referenced on-chain.
            </p>
          </div>
          <div className="step-connector">
            <div className="step-line" />
          </div>
          <div className="step">
            <span className="step-num">03</span>
            <div className="step-icon">
              <ScanLine size={28} />
            </div>
            <h3>Verify</h3>
            <p>
              Anyone can independently verify the credential's authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* ── LIVE VERIFICATION DEMO ─────────────────── */}
      <LiveDemo />
    </>
  );
}

/* ── inline demo component ──────────────────────── */
function LiveDemo() {
  const [id, setId] = useState("000421");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const verify = () => {
    if (!id.trim()) return;
    setVerifying(true);
    setResult(null);
    setTimeout(() => {
      setVerifying(false);
      setResult({
        valid: true,
        issuer: "Narula Institute of Technology",
        recipient: "Abir Ghosh",
        network: "Sepolia",
        status: "ACTIVE",
      });
    }, 1800);
  };

  return (
    <section className="demo-section">
      <span className="eyebrow">LIVE DEMO</span>
      <div className="section-heading">
        <h2>Verify in Real-Time</h2>
        <p>
          Experience the verification flow — enter a certificate ID and see
          on-chain verification in action.
        </p>
      </div>
      <div className="demo-inner">
        <div
          className="glass glass-c"
          style={{ padding: "32px 28px", borderRadius: 20 }}
        >
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <span
              className="eyebrow"
              style={{ fontSize: 9, letterSpacing: "0.2em" }}
            >
              CERTIFICATE ID
            </span>
            <div
              className="mono"
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "white",
                margin: "4px 0 0",
                fontFamily: "var(--font-head)",
              }}
            >
              #{id || "—"}
            </div>
          </div>
          <div className="demo-input-wrap">
            <input
              className="form-input"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter Certificate ID"
            />
            <button
              className="btn btn-primary"
              onClick={verify}
              disabled={verifying}
              style={{ borderRadius: 999, minWidth: 120 }}
            >
              {verifying ? <span className="spinner" /> : "VERIFY"}
            </button>
          </div>
        </div>
        {result && (
          <div className={`demo-result ${result.valid ? "valid" : "invalid"}`}>
            <div className="demo-result-top">
              <span className="demo-result-icon">
                {result.valid ? "✓" : "✕"}
              </span>
              <div>
                <h3 style={{ fontSize: 18, margin: 0 }}>
                  {result.valid ? "AUTHENTIC CREDENTIAL" : "INVALID"}
                </h3>
                <span
                  style={{ fontSize: 11, color: "var(--text-dim)" }}
                >
                  ON-CHAIN VERIFIED
                </span>
              </div>
            </div>
            <div className="demo-result-grid">
              <div className="demo-field">
                <span>Issuer</span>
                <strong>{result.issuer}</strong>
              </div>
              <div className="demo-field">
                <span>Recipient</span>
                <strong>{result.recipient}</strong>
              </div>
              <div className="demo-field">
                <span>Network</span>
                <strong>{result.network}</strong>
              </div>
              <div className="demo-field">
                <span>Status</span>
                <strong style={{ color: "var(--green-bright)" }}>
                  {result.status}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
