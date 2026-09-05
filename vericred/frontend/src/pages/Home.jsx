import { Link } from "react-router-dom";
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
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="eyebrow">VERIFIED ON-CHAIN</span>
          </div>
          <h1 className="hero-h1">
            Trust Every Credential.
            <br />
            <span className="gradient-text">Verify It On-Chain.</span>
          </h1>
          <p className="hero-sub">
            Digital credentials secured by blockchain, backed by cryptographic
            proof, and verifiable in seconds.
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

        {/* ── FLOATING CERTIFICATE ──────────────────── */}
        <div className="hero-cert-wrap">
          <div className="hero-cert">
            <div className="cert-header">
              <span className="cert-brand">VERICRED</span>
              <span className="cert-verified">
                <ShieldCheck size={10} /> VERIFIED
              </span>
            </div>
            <div className="cert-title">
              <div className="cert-label">CERTIFICATE OF ACHIEVEMENT</div>
            </div>
            <div className="cert-divider" />
            <div className="cert-name">
              <div className="cert-name-label">AWARDED TO</div>
              <h2>ABIR GHOSH</h2>
            </div>
            <div className="cert-course">B.TECH INFORMATION TECHNOLOGY</div>
            <div className="cert-institution">
              Narula Institute of Technology
            </div>
            <div className="cert-divider" />
            <div className="cert-meta">
              <div>
                <div className="cert-num">CERTIFICATE #000421</div>
                <div
                  className="cert-hash"
                  style={{ marginTop: 4 }}
                >
                  0x7a1b...9f2e
                </div>
              </div>
              <span className="cert-ipfs">IPFS PINNED</span>
              <div className="cert-qr">
                <svg width="30" height="30" viewBox="0 0 30 30">
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
                  <rect x="19" y="13" width="2" height="2" fill="#222" />
                  <rect x="23" y="19" width="2" height="2" fill="#222" />
                  <rect x="19" y="23" width="2" height="2" fill="#222" />
                  <rect x="13" y="19" width="2" height="4" fill="#222" />
                </svg>
              </div>
            </div>
          </div>
          {/* Blockchain nodes */}
          <div className="cert-nodes">
            <div className="cert-node" />
            <div className="cert-node" />
            <div className="cert-node" />
          </div>
          <div className="cert-hash">
            TX 0x3a8f...b72d · BLOCK #4291048
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
