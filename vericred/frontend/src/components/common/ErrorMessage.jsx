export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="error-msg">
      <span style={{ fontWeight: 700 }}>!</span>
      {message}
    </div>
  );
}
