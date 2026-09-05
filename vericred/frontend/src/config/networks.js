export const SEPOLIA = {
 chainId: 11155111, chainIdHex: "0xaa36a7", name: "Sepolia", currency: "ETH", rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com", explorer: "https://sepolia.etherscan.io"
};
export const networks = { [SEPOLIA.chainId]: SEPOLIA };
export const getNetwork = (id) => networks[Number(id)] || null;
