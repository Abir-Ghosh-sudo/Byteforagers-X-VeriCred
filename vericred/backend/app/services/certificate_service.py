from typing import Any

from app.services.blockchain_service import blockchain_service


class CertificateService:
    def __init__(self) -> None:
        self.blockchain = blockchain_service

    def validate_recipient(self, recipient: str) -> str:
        return self.blockchain.checksum_address(recipient)

    def validate_metadata_cid(self, metadata_cid: str) -> str:
        if not metadata_cid or not metadata_cid.strip():
            raise ValueError("Metadata CID is required")

        return metadata_cid.strip()

    def prepare_certificate_data(
        self,
        recipient: str,
        metadata_cid: str,
    ) -> dict[str, str]:
        return {
            "recipient": self.validate_recipient(recipient),
            "metadata_cid": self.validate_metadata_cid(metadata_cid),
        }

    def get_certificate(self, token_id: int) -> dict[str, Any]:
        if token_id < 1:
            raise ValueError(
                "Token ID must be greater than or equal to 1"
            )

        certificate = self.blockchain.get_certificate(token_id)

        return self.format_certificate(
            token_id=token_id,
            recipient=certificate["recipient"],
            issuer=certificate["issuer"],
            metadata_cid=certificate["metadata_cid"],
            issued_at=certificate["issued_at"],
            revoked=certificate["revoked"],
        )

    def format_certificate(
        self,
        token_id: int,
        recipient: str,
        issuer: str,
        metadata_cid: str,
        issued_at: int,
        revoked: bool,
    ) -> dict[str, Any]:
        return {
            "token_id": token_id,
            "recipient": self.blockchain.checksum_address(recipient),
            "issuer": self.blockchain.checksum_address(issuer),
            "metadata_cid": metadata_cid,
            "issued_at": issued_at,
            "revoked": revoked,
        }

    def certificate_exists(self, token_id: int) -> bool:
        if token_id < 1:
            return False

        try:
            if self.blockchain.is_connected():
                self.blockchain.get_certificate(token_id)
                return True
            return True
        except Exception:
            return False

    def get_certificate_owner(self, token_id: int) -> str:
        if token_id < 1:
            raise ValueError(
                "Token ID must be greater than or equal to 1"
            )

        return self.blockchain.get_certificate_owner(token_id)

    def is_certificate_revoked(self, token_id: int) -> bool:
        certificate = self.get_certificate(token_id)

        return bool(certificate["revoked"])

    def is_certificate_valid(self, token_id: int) -> bool:
        return self.blockchain.verify_certificate(token_id)


certificate_service = CertificateService()