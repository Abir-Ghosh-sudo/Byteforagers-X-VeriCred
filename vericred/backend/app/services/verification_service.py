from typing import Any

from app.services.blockchain_service import blockchain_service


class VerificationService:
    """
    Business logic for publicly verifying certificates
    using on-chain information.
    """

    def __init__(self) -> None:
        self.blockchain = blockchain_service

    def validate_token_id(self, token_id: int) -> int:
        """Validate a certificate token ID."""
        if token_id < 1:
            raise ValueError("Token ID must be greater than or equal to 1")

        return token_id

    def validate_wallet_address(self, address: str) -> str:
        """Validate and normalize a wallet address."""
        return self.blockchain.checksum_address(address)

    def build_verification_response(
        self,
        valid: bool,
        token_id: int,
        recipient: str,
        issuer: str,
        metadata_cid: str,
        issued_at: int,
        revoked: bool,
        message: str,
    ) -> dict[str, Any]:
        """
        Build a standardized certificate verification response.
        """
        return {
            "valid": valid,
            "token_id": token_id,
            "recipient": recipient,
            "issuer": issuer,
            "metadata_cid": metadata_cid,
            "issued_at": issued_at,
            "revoked": revoked,
            "message": message,
        }

    def is_certificate_valid(
        self,
        token_id: int,
        revoked: bool,
    ) -> bool:
        """
        Determine whether a certificate should be considered valid.

        A revoked certificate is never considered valid.
        """
        self.validate_token_id(token_id)

        return not revoked

    def verify_certificate_data(
        self,
        token_id: int,
        recipient: str,
        issuer: str,
        metadata_cid: str,
        issued_at: int,
        revoked: bool,
    ) -> dict[str, Any]:
        """
        Verify and format certificate information received
        from the blockchain layer.
        """
        token_id = self.validate_token_id(token_id)
        recipient = self.validate_wallet_address(recipient)
        issuer = self.validate_wallet_address(issuer)

        valid = self.is_certificate_valid(token_id, revoked)

        if revoked:
            message = "Certificate has been revoked."
        else:
            message = "Certificate is valid."

        return self.build_verification_response(
            valid=valid,
            token_id=token_id,
            recipient=recipient,
            issuer=issuer,
            metadata_cid=metadata_cid,
            issued_at=issued_at,
            revoked=revoked,
            message=message,
        )


verification_service = VerificationService()