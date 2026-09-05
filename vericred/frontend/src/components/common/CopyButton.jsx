import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button className="copy-btn" onClick={handle} title={`Copy ${label || ""}`}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
