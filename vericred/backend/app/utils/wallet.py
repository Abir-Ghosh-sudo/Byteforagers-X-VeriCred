from web3 import Web3


def is_valid_address(address: str) -> bool:
    """Check whether a value is a valid Ethereum address."""
    if not address:
        return False

    return Web3.is_address(address)


def to_checksum_address(address: str) -> str:
    """Convert an Ethereum address to checksum format."""
    if not is_valid_address(address):
        raise ValueError("Invalid Ethereum wallet address")

    return Web3.to_checksum_address(address)


def normalize_address(address: str) -> str:
    """Validate and normalize an Ethereum wallet address."""
    return to_checksum_address(address.strip())


def addresses_equal(
    address_a: str,
    address_b: str,
) -> bool:
    """Compare two Ethereum addresses safely."""
    if not is_valid_address(address_a):
        return False

    if not is_valid_address(address_b):
        return False

    return (
        Web3.to_checksum_address(address_a)
        == Web3.to_checksum_address(address_b)
    )


def is_zero_address(address: str) -> bool:
    """Check whether an address is the Ethereum zero address."""
    if not is_valid_address(address):
        return False

    return (
        Web3.to_checksum_address(address)
        == Web3.to_checksum_address(
            "0x0000000000000000000000000000000000000000"
        )
    )