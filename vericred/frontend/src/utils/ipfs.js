export function ipfsToHttp(cid){ if(!cid) return ""; if(cid.startsWith("http")) return cid; if(cid.startsWith("ipfs://")) cid=cid.slice(7); return `https://ipfs.io/ipfs/${cid}`; }
export default ipfsToHttp;
