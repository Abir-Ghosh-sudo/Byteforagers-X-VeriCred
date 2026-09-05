import { createContext,useCallback,useContext,useEffect,useState } from "react";
import { connectWallet } from "../services/blockchain/wallet";
import { getNetwork } from "../config/networks";
const C=createContext(null);
export function WalletProvider({children}){ const [account,setAccount]=useState(""); const [chainId,setChainId]=useState(null); const [provider,setProvider]=useState(null); const [signer,setSigner]=useState(null); const [loading,setLoading]=useState(false);
 const connect=useCallback(async()=>{setLoading(true);try{const r=await connectWallet();setAccount(r.address);setChainId(r.chainId);setProvider(r.provider);setSigner(r.signer);return r}finally{setLoading(false)}},[]);
 const disconnect=()=>{setAccount("");setChainId(null);setProvider(null);setSigner(null)};
 useEffect(()=>{if(!window.ethereum)return; const onAccounts=(a)=>a.length?connect().catch(()=>{}):disconnect(); const onChain=()=>window.location.reload(); window.ethereum.on("accountsChanged",onAccounts);window.ethereum.on("chainChanged",onChain); return()=>{window.ethereum.removeListener("accountsChanged",onAccounts);window.ethereum.removeListener("chainChanged",onChain)}},[connect]);
 const network=getNetwork(chainId); return <C.Provider value={{account,chainId,provider,signer,network,loading,connect,disconnect,isConnected:!!account}}>{children}</C.Provider> }
export const useWalletContext=()=>useContext(C);
