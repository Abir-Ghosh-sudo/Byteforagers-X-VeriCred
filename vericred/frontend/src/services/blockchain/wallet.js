import { ethers } from "ethers";
import { env } from "../../config/environment";
export async function connectWallet(){ if(!window.ethereum) throw new Error("Please install MetaMask."); const provider=new ethers.BrowserProvider(window.ethereum); const accounts=await provider.send("eth_requestAccounts",[]); const network=await provider.getNetwork(); return {provider, signer:await provider.getSigner(), address:accounts[0], chainId:Number(network.chainId)}; }
export async function switchToSepolia(){ if(!window.ethereum) throw new Error("MetaMask is not installed."); await window.ethereum.request({method:"wallet_switchEthereumChain",params:[{chainId:`0x${env.chainId.toString(16)}`}]}); }
