import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <ShieldCheck size={16} style={{ color: "var(--primary)" }} />
        VeriCred
        <span style={{ color: "var(--muted)" }}>· Verified On-Chain</span>
      </div>
      <div style={{ color: "var(--muted)", fontSize: 12 }}>
        Blockchain-powered credentials · Sepolia Testnet
      </div>
      <div className="footer-links">
        <a href="/verify">Verify</a>
        <a href="/issue">Issue</a>
        <a href="/admin">Admin</a>
      </div>
    </footer>
  );
}
