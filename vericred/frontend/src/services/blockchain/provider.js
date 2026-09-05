import { ethers } from "ethers";
import { env } from "../../config/environment";

const FALLBACK_RPCS = [
  env.rpcUrl,
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://rpc.sepolia.org",
  "https://1rpc.io/sepolia",
  "https://sepolia.drpc.org",
].filter(Boolean);

export function getReadProvider() {
  return new ethers.JsonRpcProvider(FALLBACK_RPCS[0]);
}

export function getFallbackProviders() {
  return FALLBACK_RPCS.map((url) => new ethers.JsonRpcProvider(url));
}

export async function getBrowserProvider() {
  if (!window.ethereum) throw new Error("MetaMask is not installed.");
  return new ethers.BrowserProvider(window.ethereum);
}
