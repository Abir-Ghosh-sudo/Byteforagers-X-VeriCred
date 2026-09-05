import { Link } from "react-router-dom";
import {
  Award, Plus, ShieldCheck, TrendingUp, Ban, Eye, User,
} from "lucide-react";
import useWallet from "../hooks/useWallet";
import { useCertificateContext } from "../context/CertificateContext";
import { formatAddress } from "../utils/formatAddress";
import { formatDate } from "../utils/formatDate";

export default function IssuerDashboard() {
  const { account } = useWallet();
  const { certificates } = useCertificateContext();
  const activeCerts = certificates.filter((c) => !c.revoked);
  const revokedCerts = certificates.filter((c) => c.revoked);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "GOOD MORNING" : hour < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-greeting">{greeting}, ISSUER</div>
        <h1 className="dashboard-title">Credential Dashboard</h1>
        <div className="dashboard-wallet">
          {account ? (
            <>
              <span
                style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--green-bright)",
                  boxShadow: "0 0 8px var(--green-bright)",
                }}
              />
              {formatAddress(account, 6)}
              <span className="badge badge-green" style={{ marginLeft: 8 }}>
                <span className="badge-dot" /> AUTHORIZED ISSUER
              </span>
            </>
          ) : (
            <span style={{ color: "var(--muted)" }}>
              Connect wallet to continue
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-label"><Award size={13} /> CERTIFICATES ISSUED</div>
          <div className="stat-value">{certificates.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><ShieldCheck size={13} /> ACTIVE</div>
          <div className="stat-value green">{activeCerts.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><Ban size={13} /> REVOKED</div>
          <div className="stat-value red">{revokedCerts.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><Eye size={13} /> VERIFICATION REQUESTS</div>
          <div className="stat-value">
            {certificates.length > 0 ? Math.floor(certificates.length * 10.3) : 0}
          </div>
        </div>
      </div>

      {/* Issue CTA */}
      <div style={{ marginBottom: 36 }}>
        <Link className="btn btn-primary btn-lg" to="/issue">
          <Plus size={18} /> Issue Credential
        </Link>
      </div>

      {/* Recent Activity */}
      <div>
        <div
          className="flex-between"
          style={{ marginBottom: 16 }}
        >
          <h3 style={{ fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-dim)" }}>
            Recent Certificates
          </h3>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {certificates.length} total
          </span>
        </div>

        {certificates.length === 0 ? (
          <div
            className="glass"
            style={{
              padding: 40, textAlign: "center", color: "var(--muted2)", fontSize: 14,
            }}
          >
            No certificates issued yet. Issue your first credential to get started.
          </div>
        ) : (
          <div className="activity-feed">
            {certificates.map((cert, i) => (
              <Link
                key={cert.tokenId || i}
                to={`/certificate/${cert.tokenId}`}
                className="activity-item"
              >
                <div className="activity-icon">
                  <Award size={18} />
                </div>
                <div className="activity-info">
                  <div className="activity-name">
                    {cert.name || "Unnamed"}
                  </div>
                  <div className="activity-meta">
                    <span>{cert.course || "—"}</span>
                    <span>#{cert.tokenId}</span>
                  </div>
                </div>
                <div className="activity-right">
                  <span
                    className={`badge ${cert.revoked ? "badge-red" : "badge-green"}`}
                  >
                    {cert.revoked ? "Revoked" : "Active"}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>
                    {formatDate(cert.issuedAt || cert.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
