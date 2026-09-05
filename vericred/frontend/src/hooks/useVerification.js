import { useState } from "react";
import { verifyCertificate } from "../services/certificate/verifyCertificate";

export default function useVerification() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verify = async (tokenId) => {
    setLoading(true);
    setError("");
    try {
      const r = await verifyCertificate(tokenId);
      setResult(r);
      return r;
    } catch (e) {
      setResult(null);
      setError(e.message || "Verification failed. Please try again.");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, verify, setResult, setError };
}
