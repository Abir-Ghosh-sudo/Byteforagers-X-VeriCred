import abi from "./SoulboundCertificate.json";
import { env } from "../config/environment";
export { abi };
export const contractAddress = env.contractAddress;
export const contractConfig = { address: contractAddress, abi };
