import { ethers } from "ethers";
import { env } from "../../config/environment";
export function getReadProvider(){ return new ethers.JsonRpcProvider(env.rpcUrl); }
export async function getBrowserProvider(){ if(!window.ethereum) throw new Error("MetaMask is not installed."); return new ethers.BrowserProvider(window.ethereum); }
