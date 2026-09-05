import { getCertificateApi } from "../api/certificates";
export async function getCertificate(tokenId){ return getCertificateApi(tokenId); }
