import { ethers } from "ethers";
import { contractConfig } from "../../contracts/contractConfig";
import { getReadProvider } from "./provider";
export function requireContractAddress(){ if(!contractConfig.address || !ethers.isAddress(contractConfig.address)) throw new Error("Contract address is not configured. Add VITE_CONTRACT_ADDRESS to frontend/.env"); }
export function getReadContract(){ requireContractAddress(); return new ethers.Contract(contractConfig.address, contractConfig.abi, getReadProvider()); }
export function getWriteContract(signer){ requireContractAddress(); return new ethers.Contract(contractConfig.address, contractConfig.abi, signer); }
