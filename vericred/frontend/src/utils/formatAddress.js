export function formatAddress(address="", chars=4){ if(!address) return "—"; return `${address.slice(0, chars+2)}…${address.slice(-chars)}`; }
export default formatAddress;
