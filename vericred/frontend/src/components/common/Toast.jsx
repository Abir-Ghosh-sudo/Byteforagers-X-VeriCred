export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  return (
    <div className="toast">
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}
