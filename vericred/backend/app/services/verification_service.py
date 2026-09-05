from typing import Any

from app.services.blockchain_service import blockchain_service


class VerificationService:
    def __init__(self) -> None:
        self.blockchain = blockchain_service

    def validate_token_id(self, token_id: int) -> int:
        if token_id < 1:
            raise ValueError(
                "Token ID must be greater than or equal to 1"
            )

        return token_id

    def validate_wallet_address(self, address: str) -> str:
        return self.blockchain.checksum_address(address)

    def get_certificate_data(self, token_id: int) -> dict[str, Any]:
        token_id = self.validate_token_id(token_id)

        try:
            return self.blockchain.get_certificate(token_id)
        except Exception as exc:
            raise ValueError(
                f"Certificate not found: {exc}"
            ) from exc

    def verify_certificate(self, token_id: int) -> dict[str, Any]:
        token_id = self.validate_token_id(token_id)

        certificate = self.get_certificate_data(token_id)

        valid = self.blockchain.verify_certificate(token_id)

        message = (
            "Certificate is valid."
            if valid
            else "Certificate has been revoked."
        )

        return self.build_verification_response(
            valid=valid,
            token_id=token_id,
            recipient=certificate["recipient"],
            issuer=certificate["issuer"],
            metadata_cid=certificate["metadata_cid"],
            issued_at=certificate["issued_at"],
            revoked=certificate["revoked"],
            message=message,
        )

    def verify_wallet(
        self,
        address: str,
    ) -> dict[str, Any]:
        wallet = self.validate_wallet_address(address)

        return {
            "wallet": wallet,
            "message": "Wallet address is valid.",
        }

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
        return {
            "valid": valid,
            "token_id": token_id,
            "recipient": self.validate_wallet_address(recipient),
            "issuer": self.validate_wallet_address(issuer),
            "metadata_cid": metadata_cid,
            "issued_at": issued_at,
            "revoked": revoked,
            "message": message,
        }

    def is_certificate_valid(
        self,
        token_id: int,
        revoked: bool | None = None,
    ) -> bool:
        token_id = self.validate_token_id(token_id)

        if revoked is not None:
            return not revoked

        return self.blockchain.verify_certificate(token_id)

    def verify_certificate_data(
        self,
        token_id: int,
        recipient: str,
        issuer: str,
        metadata_cid: str,
        issued_at: int,
        revoked: bool,
    ) -> dict[str, Any]:
        token_id = self.validate_token_id(token_id)

        recipient = self.validate_wallet_address(recipient)
        issuer = self.validate_wallet_address(issuer)

        valid = not revoked

        message = (
            "Certificate is valid."
            if valid
            else "Certificate has been revoked."
        )

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