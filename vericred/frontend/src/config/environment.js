export const env = {
 apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
 contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || "",
 chainId: Number(import.meta.env.VITE_CHAIN_ID || 11155111),
 rpcUrl: import.meta.env.VITE_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
 appName: import.meta.env.VITE_APP_NAME || "VeriCred",
 appUrl: import.meta.env.VITE_APP_URL || window.location.origin,
 adminAddress: import.meta.env.VITE_ADMIN_ADDRESS || "",
};
