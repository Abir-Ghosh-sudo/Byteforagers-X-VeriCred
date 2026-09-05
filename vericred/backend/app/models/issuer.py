from dataclasses import dataclass
from datetime import datetime


@dataclass
class Issuer:
    """
    Represents an organization authorized to issue VeriCred certificates.
    """

    address: str
    name: str
    email: str | None = None
    authorized: bool = False
    created_at: datetime | None = None

    def __post_init__(self) -> None:
        """Set creation time when the model is initialized."""
        if self.created_at is None:
            self.created_at = datetime.utcnow()

    def to_dict(self) -> dict:
        """Convert the issuer model into a dictionary."""
        return {
            "address": self.address,
            "name": self.name,
            "email": self.email,
            "authorized": self.authorized,
            "created_at": self.created_at.isoformat()
            if self.created_at
            else None,
        }