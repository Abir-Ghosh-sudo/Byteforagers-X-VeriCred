import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { ShieldCheck, Menu, X, Wifi } from "lucide-react";
import useWallet from "../../hooks/useWallet";
import { formatAddress } from "../../utils/formatAddress";

export default function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false);
  const { account, connect, disconnect, loading, network } = useWallet();
  const close = () => setOpen(false);

  const handleWallet = () => {
    if (account) disconnect();
    else connect().catch(e => alert(e.message));
  };

  const links = [
    ["/verify", "Verify"],
    ["/issue", "Issue"],
    ["/dashboard", "Dashboard"],
  ];

  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
      {/* Left */}
      <div className="navbar-left">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-icon">
            <ShieldCheck size={18} />
          </span>
          <span className="brand-text">
            Veri<em>Cred</em>
          </span>
        </Link>
      </div>

      {/* Center */}
      <nav className="navbar-center">
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right */}
      <div className="navbar-right">
        <div className="network-pill">
          <span className="net-dot" />
          {network?.name || "Sepolia"}
        </div>
        <button
          className={`wallet-btn${account ? " connected" : ""}`}
          onClick={handleWallet}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner" style={{ width: 14, height: 14 }} />
          ) : account ? (
            <>
              <span className="wallet-connected-dot" />
              {formatAddress(account)}
            </>
          ) : (
            <>
              <Wifi size={14} />
              Connect Wallet
            </>
          )}
        </button>
        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      <nav className={`mobile-nav${open ? " open" : ""}`}>
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            onClick={close}
          >
            {label}
          </NavLink>
        ))}
        <NavLink to="/admin" className="nav-link" onClick={close}>
          Admin
        </NavLink>
        <div className="mobile-nav-footer">
          <div className="network-pill">
            <span className="net-dot" />
            {network?.name || "Sepolia"}
          </div>
          <button
            className={`wallet-btn${account ? " connected" : ""}`}
            onClick={() => { handleWallet(); close(); }}
            disabled={loading}
          >
            {account ? (
              <><span className="wallet-connected-dot" />{formatAddress(account)}</>
            ) : (
              <><Wifi size={13} />Connect Wallet</>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
