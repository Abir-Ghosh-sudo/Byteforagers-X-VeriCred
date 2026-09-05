from typing import Any

from app.services.blockchain_service import blockchain_service


class CertificateService:
    """
    Business logic for retrieving and preparing certificate data.
    """

    def __init__(self) -> None:
        self.blockchain = blockchain_service

    def validate_recipient(self, recipient: str) -> str:
        """Validate and normalize a student wallet address."""
        return self.blockchain.checksum_address(recipient)

    def validate_metadata_cid(self, metadata_cid: str) -> str:
        """Validate an IPFS CID."""
        if not metadata_cid or not metadata_cid.strip():
            raise ValueError("Metadata CID is required")

        return metadata_cid.strip()

    def prepare_certificate_data(
        self,
        recipient: str,
        metadata_cid: str,
    ) -> dict[str, str]:
        """
        Validate certificate input before it is sent to the
        blockchain minting flow.
        """
        return {
            "recipient": self.validate_recipient(recipient),
            "metadata_cid": self.validate_metadata_cid(metadata_cid),
        }

    def format_certificate(
        self,
        token_id: int,
        recipient: str,
        issuer: str,
        metadata_cid: str,
        issued_at: int,
        revoked: bool,
    ) -> dict[str, Any]:
        """Return a consistent certificate response."""
        return {
            "token_id": token_id,
            "recipient": self.blockchain.checksum_address(recipient),
            "issuer": self.blockchain.checksum_address(issuer),
            "metadata_cid": metadata_cid,
            "issued_at": issued_at,
            "revoked": revoked,
        }

    def certificate_exists(self, token_id: int) -> bool:
        """
        Check whether a certificate token exists.

        The actual contract call will be connected when the
        contract ABI service is integrated.
        """
        if token_id < 1:
            return False

        return True


certificate_service = CertificateService()