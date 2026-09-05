export default function VerifiedBadge({valid=true}){return <span className={`verified-badge ${valid?"yes":"no"}`}>{valid?"✓ Verified on blockchain":"✕ Verification failed"}</span>}
