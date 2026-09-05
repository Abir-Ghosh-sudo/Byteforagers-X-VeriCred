export function formatDate(value){ if(!value) return "—"; const d = new Date(Number(value) > 1e12 ? Number(value) : Number(value)*1000 || value); return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(undefined,{day:"2-digit",month:"short",year:"numeric"}); }
export default formatDate;
