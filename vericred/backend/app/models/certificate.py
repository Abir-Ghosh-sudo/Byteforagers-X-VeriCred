from dataclasses import dataclass
from datetime import datetime


@dataclass
class Certificate:
    """
    Represents an on-chain VeriCred certificate.
    """

    token_id: int
    recipient: str
    issuer: str
    metadata_cid: str
    issued_at: int
    revoked: bool = False

    @property
    def issued_datetime(self) -> datetime:
        """Convert the blockchain timestamp to a datetime object."""
        return datetime.fromtimestamp(self.issued_at)

    @property
    def verification_url(self) -> str:
        """Return the token-based verification path."""
        return f"/verify/{self.token_id}"

    def to_dict(self) -> dict:
        """Convert the certificate model into a dictionary."""
        return {
            "token_id": self.token_id,
            "recipient": self.recipient,
            "issuer": self.issuer,
            "metadata_cid": self.metadata_cid,
            "issued_at": self.issued_at,
            "revoked": self.revoked,
        }