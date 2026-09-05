import { ShieldCheck } from "lucide-react";

export default function VerifiedBadge({ valid = true }) {
  return (
    <span className={`badge ${valid ? "badge-green" : "badge-red"}`}>
      <ShieldCheck size={11} />
      {valid ? "Verified On-Chain" : "Verification Failed"}
    </span>
  );
}
