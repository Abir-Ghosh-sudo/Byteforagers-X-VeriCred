export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-full">
      <span className="spinner spinner-lg" />
      <span>{text}</span>
    </div>
  );
}
