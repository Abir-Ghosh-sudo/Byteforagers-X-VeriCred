from typing import Any

from app.services.blockchain_service import blockchain_service


class IssuerService:
    """
    Business logic for managing and validating certificate issuers.
    """

    def __init__(self) -> None:
        self.blockchain = blockchain_service

    def validate_address(self, address: str) -> str:
        """Validate and normalize an issuer wallet address."""
        return self.blockchain.checksum_address(address)

    def prepare_issuer_data(
        self,
        address: str,
        name: str,
        email: str | None = None,
    ) -> dict[str, Any]:
        """Validate and prepare issuer information."""
        if not name or not name.strip():
            raise ValueError("Issuer name is required")

        return {
            "address": self.validate_address(address),
            "name": name.strip(),
            "email": email.strip() if email else None,
        }

    def build_issuer_response(
        self,
        address: str,
        name: str,
        authorized: bool,
        email: str | None = None,
    ) -> dict[str, Any]:
        """Build a standardized issuer response."""
        return {
            "address": self.validate_address(address),
            "name": name,
            "email": email,
            "authorized": authorized,
        }

    def build_issuer_status(
        self,
        address: str,
        authorized: bool,
    ) -> dict[str, Any]:
        """Build an issuer authorization status response."""
        return {
            "address": self.validate_address(address),
            "authorized": authorized,
        }

    def is_authorized(self, authorized: bool) -> bool:
        """Return whether an issuer is authorized to mint certificates."""
        return authorized


issuer_service = IssuerService()