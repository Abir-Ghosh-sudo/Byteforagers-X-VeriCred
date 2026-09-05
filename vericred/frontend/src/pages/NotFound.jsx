import { Link } from "react-router-dom";
import { ArrowLeft, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: "40px 24px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: 80, height: 80, borderRadius: 20,
          background: "var(--primary-dim)",
          border: "1px solid var(--line-c)",
          display: "grid", placeItems: "center",
          marginBottom: 24,
          color: "var(--primary)",
        }}
      >
        <Ghost size={36} />
      </div>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>404</h1>
      <p style={{ color: "var(--text-dim)", fontSize: 16, marginBottom: 28, maxWidth: 400 }}>
        This page doesn't exist on the blockchain... or anywhere else.
      </p>
      <Link className="btn btn-secondary" to="/">
        <ArrowLeft size={15} /> Return Home
      </Link>
    </div>
  );
}
