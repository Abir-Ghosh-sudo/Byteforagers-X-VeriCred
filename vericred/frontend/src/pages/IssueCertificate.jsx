import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Upload, HardDrive, Cpu, PartyPopper } from "lucide-react";
import useWallet from "../hooks/useWallet";
import { prepareCertificate } from "../services/api/certificates";
import { mintCertificate } from "../services/blockchain/transactions";
import { useCertificateContext } from "../context/CertificateContext";
import { DEFAULT_CERTIFICATE } from "../utils/constants";
import { contractAddress } from "../contracts/contractConfig";
import { formatAddress } from "../utils/formatAddress";
import { validateCertificateForm } from "../utils/validation";

const STEPS = [
  { num: "01", label: "DETAILS", icon: Upload },
  { num: "02", label: "METADATA", icon: HardDrive },
  { num: "03", label: "BLOCKCHAIN", icon: Cpu },
  { num: "04", label: "COMPLETE", icon: PartyPopper },
];

export default function IssueCertificate() {
  const { signer, account } = useWallet();
  const { add } = useCertificateContext();
  const nav = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    recipient: "", name: "", course: "", institution: "",
    date: new Date().toISOString().slice(0, 10), metadataCID: "", description: "",
  });
  const [errors, setErrors] = useState({});
  const [ipfsStatus, setIpfsStatus] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [txResult, setTxResult] = useState(null);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitDetails = (e) => {
    e.preventDefault();
    const er = validateCertificateForm(form);
    if (Object.keys(er).length) { setErrors(er); return; }
    setErrors({});
    setStep(1);
    handleIpfs();
  };

  const handleIpfs = async () => {
    setLoading(true);
    setIpfsStatus("Uploading metadata...");
    await sleep(800);
    setIpfsStatus("Pinning to IPFS...");
    let cid = form.metadataCID || "demo-certificate-metadata";
    try {
      const prepared = await prepareCertificate({
        recipient: form.recipient,
        metadata_cid: cid,
      });
      cid = prepared.certificate?.metadata_cid || cid;
    } catch {}
    await sleep(600);
    setIpfsStatus("CID generated.");
    setForm((f) => ({ ...f, metadataCID: cid }));
    setLoading(false);
    setTimeout(() => setStep(2), 600);
  };

  const handleMint = async () => {
    setLoading(true);
    const cid = form.metadataCID || "demo-certificate-metadata";

    if (!signer) {
      const demo = {
        ...DEFAULT_CERTIFICATE,
        ...form,
        tokenId: String(Date.now()).slice(-5),
        issuer: account || "0xDemoIssuer",
      };
      add(demo);
      setTxResult({ tokenId: demo.tokenId });
      setStep(3);
      setLoading(false);
      return;
    }

    setTxStatus("WAITING FOR WALLET CONFIRMATION");
    try {
      const minted = await mintCertificate(signer, form.recipient, cid);
      setTxStatus("TRANSACTION CONFIRMED");
      const certificate = {
        ...form,
        tokenId: minted.tokenId || "pending",
        issuer: account,
        issuedAt: Date.now(),
        metadataCID: cid,
      };
      add(certificate);
      setTxResult(minted);
      setStep(3);
    } catch (e) {
      setTxStatus("");
      alert(e.shortMessage || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issue-page">
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <span className="eyebrow">ISSUER</span>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", marginBottom: 8 }}>
          Issue a Certificate
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 15, maxWidth: 440, margin: "0 auto" }}>
          Prepare metadata, then sign the mint transaction with MetaMask.
        </p>
      </div>

      {/* Wizard Progress */}
      <div className="wizard-progress">
        {STEPS.map((s, i) => (
          <div key={s.num} style={{ display: "contents" }}>
            <div className={`wizard-step${step === i ? " active" : step > i ? " done" : ""}`}>
              <div className="wizard-step-num">
                {step > i ? <Check size={13} /> : s.num}
              </div>
              <span className="wizard-step-label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`wizard-line${step > i ? " done" : ""}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Details */}
      {step === 0 && (
        <form className="wizard-card" onSubmit={submitDetails}>
          <h3 style={{ marginBottom: 24 }}>Credential Details</h3>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Student Name</label>
              <input className={`form-input${errors.name ? " error" : ""}`} name="name" value={form.name} onChange={change} placeholder="e.g. Abir Ghosh" />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Recipient Wallet</label>
              <input className={`form-input${errors.recipient ? " error" : ""}`} name="recipient" value={form.recipient} onChange={change} placeholder="0x..." />
              {errors.recipient && <span className="form-error">{errors.recipient}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Course / Credential</label>
              <input className={`form-input${errors.course ? " error" : ""}`} name="course" value={form.course} onChange={change} placeholder="B.Tech Information Technology" />
              {errors.course && <span className="form-error">{errors.course}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Institution</label>
              <input className={`form-input${errors.institution ? " error" : ""}`} name="institution" value={form.institution} onChange={change} placeholder="Narula Institute of Technology" />
              {errors.institution && <span className="form-error">{errors.institution}</span>}
            </div>
            <div className="form-field">
              <label className="form-label">Issue Date</label>
              <input className="form-input" type="date" name="date" value={form.date} onChange={change} />
            </div>
            <div className="form-field">
              <label className="form-label">IPFS CID <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
              <input className="form-input" name="metadataCID" value={form.metadataCID} onChange={change} placeholder="bafy..." />
            </div>
            <div className="form-field form-full">
              <label className="form-label">Description</label>
              <input className="form-input" name="description" value={form.description} onChange={change} placeholder="Additional details..." />
            </div>
          </div>
          <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary btn-lg">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* Step 1: IPFS */}
      {step === 1 && (
        <div className="wizard-card" style={{ textAlign: "center" }}>
          <h3 style={{ marginBottom: 20 }}>Uploading to IPFS</h3>
          <div className="ipfs-status">
            {["Uploading metadata...", "Pinning to IPFS...", "CID generated."].map((s) => (
              <div
                key={s}
                className={`ipfs-step${
                  ipfsStatus === s ? " active" : (
                    (s === "Uploading metadata..." && ipfsStatus !== "Uploading metadata...") ||
                    (s === "Pinning to IPFS..." && ipfsStatus === "CID generated.")
                  ) ? " done" : ""
                }`}
              >
                <span className="ipfs-step-icon">
                  {((s === "Uploading metadata..." && ipfsStatus !== "Uploading metadata...") ||
                    (s === "Pinning to IPFS..." && ipfsStatus === "CID generated.")) ? (
                    <Check size={12} />
                  ) : ipfsStatus === s ? (
                    <span className="spinner" style={{ width: 12, height: 12 }} />
                  ) : (
                    "·"
                  )}
                </span>
                {s}
              </div>
            ))}
          </div>
          {ipfsStatus === "CID generated." && (
            <div className="mono" style={{ marginTop: 14, color: "var(--primary)" }}>
              CID: {form.metadataCID}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Blockchain */}
      {step === 2 && (
        <div className="wizard-card" style={{ textAlign: "center" }}>
          <h3 style={{ marginBottom: 20 }}>Mint On-Chain</h3>
          <div className="blockchain-stage">
            <div className="blockchain-field">
              <span>Smart Contract</span>
              <strong>{formatAddress(contractAddress, 10) || "Not configured"}</strong>
            </div>
            <div className="blockchain-field">
              <span>Network</span>
              <strong>SEPOLIA</strong>
            </div>
            <div className="blockchain-field">
              <span>Issuer</span>
              <strong>{formatAddress(account, 10) || "Connect wallet"}</strong>
            </div>
            <div className="blockchain-field">
              <span>Recipient</span>
              <strong>{formatAddress(form.recipient, 10)}</strong>
            </div>
          </div>

          {txStatus && (
            <div className={`tx-status ${txStatus.includes("CONFIRMED") ? "success" : "pending"}`} style={{ marginTop: 16 }}>
              {txStatus.includes("CONFIRMED") ? <Check size={16} /> : <span className="spinner" style={{ width: 14, height: 14 }} />}
              {" "}{txStatus}
            </div>
          )}

          {!txStatus && (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleMint}
              disabled={loading}
              style={{ marginTop: 20 }}
            >
              {loading ? <span className="spinner" /> : <>Mint Credential <ArrowRight size={16} /></>}
            </button>
          )}
        </div>
      )}

      {/* Step 3: Complete */}
      {step === 3 && (
        <div className="wizard-card">
          <div className="success-anim">
            <div className="success-ring">✓</div>
            <h2 style={{ marginBottom: 6 }}>Transaction Confirmed</h2>
            <p style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: 24 }}>
              Your credential has been minted successfully.
            </p>
            {txResult && (
              <div className="blockchain-stage" style={{ textAlign: "left", maxWidth: 400, margin: "0 auto 24px" }}>
                <div className="blockchain-field">
                  <span>Token ID</span>
                  <strong>#{txResult.tokenId}</strong>
                </div>
                <div className="blockchain-field">
                  <span>Network</span>
                  <strong>Sepolia</strong>
                </div>
                {txResult.txHash && (
                  <div className="blockchain-field" style={{ gridColumn: "1 / -1" }}>
                    <span>TX Hash</span>
                    <strong>{txResult.txHash}</strong>
                  </div>
                )}
                {txResult.blockNumber && (
                  <div className="blockchain-field">
                    <span>Block</span>
                    <strong>#{txResult.blockNumber}</strong>
                  </div>
                )}
              </div>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Link
                className="btn btn-primary"
                to={`/certificate/${txResult?.tokenId || "0"}`}
              >
                View Certificate <ArrowRight size={14} />
              </Link>
              <Link className="btn btn-secondary" to="/dashboard">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
