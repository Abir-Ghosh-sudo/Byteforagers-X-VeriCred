from typing import Any

from app.models.certificate import Certificate


class CertificateRepository:
    """
    Repository for certificate data access.

    The current implementation uses in-memory storage.
    Blockchain-backed persistence will be connected through
    the blockchain service.
    """

    def __init__(self) -> None:
        self._certificates: dict[int, Certificate] = {}

    def save(self, certificate: Certificate) -> Certificate:
        """Store a certificate."""
        self._certificates[certificate.token_id] = certificate
        return certificate

    def get_by_token_id(self, token_id: int) -> Certificate | None:
        """Find a certificate by token ID."""
        return self._certificates.get(token_id)

    def exists(self, token_id: int) -> bool:
        """Check whether a certificate exists."""
        return token_id in self._certificates

    def delete(self, token_id: int) -> bool:
        """Remove a certificate from local storage."""
        if token_id not in self._certificates:
            return False

        del self._certificates[token_id]
        return True

    def get_all(self) -> list[Certificate]:
        """Return all locally stored certificates."""
        return list(self._certificates.values())

    def find_by_recipient(self, recipient: str) -> list[Certificate]:
        """Find certificates belonging to a wallet address."""
        recipient = recipient.lower()

        return [
            certificate
            for certificate in self._certificates.values()
            if certificate.recipient.lower() == recipient
        ]

    def find_by_issuer(self, issuer: str) -> list[Certificate]:
        """Find certificates issued by a wallet address."""
        issuer = issuer.lower()

        return [
            certificate
            for certificate in self._certificates.values()
            if certificate.issuer.lower() == issuer
        ]

    def update_revocation_status(
        self,
        token_id: int,
        revoked: bool,
    ) -> Certificate | None:
        """Update the local revocation status of a certificate."""
        certificate = self.get_by_token_id(token_id)

        if certificate is None:
            return None

        certificate.revoked = revoked
        return certificate

    def count(self) -> int:
        """Return the number of locally stored certificates."""
        return len(self._certificates)

    def clear(self) -> None:
        """Clear the local repository."""
        self._certificates.clear()

    def to_dict_list(self) -> list[dict[str, Any]]:
        """Return all certificates as dictionaries."""
        return [
            certificate.to_dict()
            for certificate in self._certificates.values()
        ]


certificate_repository = CertificateRepository()