export default function Button({ children, variant = "primary", loading = false, disabled, className = "", ...props }) {
  return (
    <button
      className={`btn btn-${variant}${className ? " " + className : ""}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="spinner" /> : children}
    </button>
  );
}
