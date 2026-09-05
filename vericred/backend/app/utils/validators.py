import re

from web3 import Web3


ETHEREUM_ADDRESS_PATTERN = re.compile(
    r"^0x[a-fA-F0-9]{40}$"
)


def validate_wallet_address(address: str) -> str:
    """
    Validate and return an Ethereum wallet address
    in checksum format.
    """
    if not address or not address.strip():
        raise ValueError("Wallet address is required")

    address = address.strip()

    if not ETHEREUM_ADDRESS_PATTERN.fullmatch(address):
        raise ValueError("Invalid Ethereum wallet address")

    if not Web3.is_address(address):
        raise ValueError("Invalid Ethereum wallet address")

    return Web3.to_checksum_address(address)


def validate_token_id(token_id: int) -> int:
    """Validate a certificate token ID."""
    if not isinstance(token_id, int):
        raise ValueError("Token ID must be an integer")

    if token_id < 1:
        raise ValueError("Token ID must be greater than or equal to 1")

    return token_id


def validate_ipfs_cid(cid: str) -> str:
    """Validate a basic IPFS CID value."""
    if not cid or not cid.strip():
        raise ValueError("IPFS CID is required")

    cid = cid.strip()

    if len(cid) < 10:
        raise ValueError("Invalid IPFS CID")

    return cid


def validate_certificate_name(name: str) -> str:
    """Validate a certificate holder's name."""
    if not name or not name.strip():
        raise ValueError("Certificate name is required")

    return name.strip()


def validate_course_name(course: str) -> str:
    """Validate a certificate course name."""
    if not course or not course.strip():
        raise ValueError("Course name is required")

    return course.strip()


def validate_issuer_name(name: str) -> str:
    """Validate an issuer organization name."""
    if not name or not name.strip():
        raise ValueError("Issuer name is required")

    return name.strip()


def validate_email(email: str | None) -> str | None:
    """Validate an optional email address."""
    if email is None:
        return None

    email = email.strip()

    if not email:
        return None

    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    if not re.fullmatch(pattern, email):
        raise ValueError("Invalid email address")

    return email