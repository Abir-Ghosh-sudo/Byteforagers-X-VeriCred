from web3 import Web3

from app.config.settings import settings


def get_web3() -> Web3:
    if not settings.SEPOLIA_RPC_URL:
        raise RuntimeError("SEPOLIA_RPC_URL is not configured")

    web3 = Web3(Web3.HTTPProvider(settings.SEPOLIA_RPC_URL))

    if not web3.is_connected():
        raise RuntimeError("Unable to connect to Sepolia RPC")

    return web3


def get_contract_address() -> str:
    if not settings.CONTRACT_ADDRESS:
        raise RuntimeError("CONTRACT_ADDRESS is not configured")

    if not Web3.is_address(settings.CONTRACT_ADDRESS):
        raise RuntimeError("Invalid CONTRACT_ADDRESS")

    return Web3.to_checksum_address(settings.CONTRACT_ADDRESS)