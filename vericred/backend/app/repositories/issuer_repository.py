from app.models.issuer import Issuer


class IssuerRepository:
    """
    Repository for issuer data access.

    The current implementation uses in-memory storage.
    The blockchain remains the source of truth for issuer
    authorization status.
    """

    def __init__(self) -> None:
        self._issuers: dict[str, Issuer] = {}

    def save(self, issuer: Issuer) -> Issuer:
        """Store an issuer."""
        self._issuers[issuer.address.lower()] = issuer
        return issuer

    def get_by_address(self, address: str) -> Issuer | None:
        """Find an issuer by wallet address."""
        return self._issuers.get(address.lower())

    def exists(self, address: str) -> bool:
        """Check whether an issuer exists."""
        return address.lower() in self._issuers

    def delete(self, address: str) -> bool:
        """Remove an issuer from local storage."""
        key = address.lower()

        if key not in self._issuers:
            return False

        del self._issuers[key]
        return True

    def get_all(self) -> list[Issuer]:
        """Return all locally stored issuers."""
        return list(self._issuers.values())

    def find_authorized(self) -> list[Issuer]:
        """Return all locally authorized issuers."""
        return [
            issuer
            for issuer in self._issuers.values()
            if issuer.authorized
        ]

    def update_authorization(
        self,
        address: str,
        authorized: bool,
    ) -> Issuer | None:
        """Update the local authorization status of an issuer."""
        issuer = self.get_by_address(address)

        if issuer is None:
            return None

        issuer.authorized = authorized
        return issuer

    def count(self) -> int:
        """Return the number of locally stored issuers."""
        return len(self._issuers)

    def clear(self) -> None:
        """Clear the local repository."""
        self._issuers.clear()


issuer_repository = IssuerRepository()