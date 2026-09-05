from web3 import Web3

from app.config.blockchain import get_web3


def get_provider() -> Web3:
    """
    Return the configured Web3 provider.
    """
    return get_web3()


def is_provider_connected() -> bool:
    """
    Check whether the blockchain provider is connected.
    """
    try:
        provider = get_provider()
        return provider.is_connected()
    except Exception:
        return False


def get_network_chain_id() -> int:
    """
    Return the chain ID of the connected network.
    """
    provider = get_provider()
    return provider.eth.chain_id


def get_latest_block_number() -> int:
    """
    Return the latest block number from the network.
    """
    provider = get_provider()
    return provider.eth.block_number