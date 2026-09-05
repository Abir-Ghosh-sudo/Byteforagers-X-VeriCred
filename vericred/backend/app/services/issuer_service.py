from typing import Any

from app.services.blockchain_service import blockchain_service


class IssuerService:
    def __init__(self) -> None:
        self.blockchain = blockchain_service

    def validate_address(self, address: str) -> str:
        return self.blockchain.checksum_address(address)

    def prepare_issuer_data(
        self,
        address: str,
        name: str,
        email: str | None = None,
    ) -> dict[str, Any]:
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
        return {
            "address": self.validate_address(address),
            "authorized": authorized,
        }

    def is_authorized(self, target: Any) -> bool:
        """
        Check whether an issuer is authorized to mint certificates.
        Supports checking a boolean status directly or verifying
        a wallet address against the blockchain.
        """
        if isinstance(target, bool):
            return target

        if isinstance(target, str):
            wallet = self.validate_address(target)
            return self.blockchain.is_authorized_issuer(wallet)

        return bool(target)

    def get_issuer_status(
        self,
        address: str,
    ) -> dict[str, Any]:
        """
        Return the current on-chain authorization status
        of an issuer wallet.
        """
        wallet = self.validate_address(address)

        authorized = self.blockchain.is_authorized_issuer(wallet)

        return self.build_issuer_status(
            address=wallet,
            authorized=authorized,
        )


issuer_service = IssuerService()