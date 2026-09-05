import { useEffect, useState } from "react";
import { ShieldCheck, Plus, Trash2, Cpu, Globe, User, XCircle } from "lucide-react";
import useWallet from "../hooks/useWallet";
import { addIssuer, removeIssuer } from "../services/blockchain/transactions";
import { getIssuers } from "../services/api/issuers";
import { contractAddress } from "../contracts/contractConfig";
import { formatAddress } from "../utils/formatAddress";
import CopyButton from "../components/common/CopyButton";

export default function AdminDashboard() {
  const { signer, account } = useWallet();
  const [issuers, setIssuers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addAddr, setAddAddr] = useState("");
  const [removeAddr, setRemoveAddr] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const refresh = () =>
    getIssuers()
      .then((r) => setIssuers(r.issuers || []))
      .catch(() => setIssuers([]));

  useEffect(refresh, []);

  const act = async (fn, address, close) => {
    if (!signer) return alert("Connect the admin wallet first.");
    setLoading(true);
    try {
      await fn(signer, address);
      alert("Transaction confirmed.");
      refresh();
      close();
    } catch (e) {
      alert(e.shortMessage || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <span className="eyebrow">ADMIN CONTROL</span>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", marginBottom: 8 }}>
          Blockchain Control Panel
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 15, maxWidth: 500 }}>
          Authorize or remove wallets that can mint credentials on-chain.
        </p>
      </div>

      {/* Info Cards */}
      <div className="admin-info-grid">
        <div className="admin-info-card">
          <div className="admin-info-label"><Cpu size={12} style={{ display: "inline", marginRight: 4 }} /> CONTRACT</div>
          <div className="admin-info-val">
            {formatAddress(contractAddress, 12) || "Not configured"}
            {contractAddress && <CopyButton text={contractAddress} />}
          </div>
        </div>
        <div className="admin-info-card">
          <div className="admin-info-label"><Globe size={12} style={{ display: "inline", marginRight: 4 }} /> NETWORK</div>
          <div className="admin-info-val">Sepolia Testnet</div>
        </div>
        <div className="admin-info-card">
          <div className="admin-info-label"><User size={12} style={{ display: "inline", marginRight: 4 }} /> OWNER</div>
          <div className="admin-info-val">
            {formatAddress(account, 12) || "Not connected"}
            {account && <CopyButton text={account} />}
          </div>
        </div>
      </div>

      {/* Issuer Registry */}
      <div
        className="glass"
        style={{ padding: "28px", borderRadius: 20 }}
      >
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={14} style={{ color: "var(--primary)" }} />
            ISSUER REGISTRY
          </h3>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
              <Plus size={13} /> Add Issuer
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setShowRemoveModal(true)}>
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </div>

        {issuers.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--muted2)", padding: "24px", fontSize: 13 }}>
            No authorized issuers found.
          </div>
        ) : (
          <div className="issuer-list">
            {issuers.map((addr, i) => (
              <div key={i} className="issuer-item">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "var(--primary-dim)",
                      border: "1px solid var(--line-c)",
                      display: "grid", placeItems: "center",
                      color: "var(--primary)", fontSize: 12, fontWeight: 700,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span className="issuer-addr">{addr}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CopyButton text={addr} label="Address" />
                  <span className="badge badge-green">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Add Issuer</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="form-field" style={{ marginBottom: 20 }}>
              <label className="form-label">Wallet Address</label>
              <input
                className="form-input"
                value={addAddr}
                onChange={(e) => setAddAddr(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={() => act(addIssuer, addAddr, () => { setShowAddModal(false); setAddAddr(""); })}
              disabled={loading || !addAddr.trim()}
            >
              {loading ? <span className="spinner" /> : <><Plus size={14} /> Authorize Issuer</>}
            </button>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {showRemoveModal && (
        <div className="modal-backdrop" onClick={() => setShowRemoveModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Remove Issuer</h3>
              <button className="modal-close" onClick={() => setShowRemoveModal(false)}>×</button>
            </div>
            <div className="form-field" style={{ marginBottom: 20 }}>
              <label className="form-label">Wallet Address</label>
              <input
                className="form-input"
                value={removeAddr}
                onChange={(e) => setRemoveAddr(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <button
              className="btn btn-danger w-full"
              onClick={() => act(removeIssuer, removeAddr, () => { setShowRemoveModal(false); setRemoveAddr(""); })}
              disabled={loading || !removeAddr.trim()}
            >
              {loading ? <span className="spinner" /> : <><Trash2 size={14} /> Remove Issuer</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
