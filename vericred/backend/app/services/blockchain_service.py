from typing import Any

from web3 import Web3

from app.config.blockchain import get_contract_address, get_web3


class BlockchainService:
    """
    Service responsible for reading certificate and issuer data
    directly from the deployed SoulboundCertificate smart contract.
    """

    def __init__(self) -> None:
        self.web3: Web3 = get_web3()
        self.contract_address = get_contract_address()

        # The actual ABI will be loaded from the backend blockchain
        # package once the deployment artifact is available.
        self.contract = None

    def is_connected(self) -> bool:
        """Check whether the backend is connected to the blockchain."""
        return self.web3.is_connected()

    def get_chain_id(self) -> int:
        """Return the connected blockchain network chain ID."""
        return self.web3.eth.chain_id

    def get_latest_block(self) -> int:
        """Return the latest block number."""
        return self.web3.eth.block_number

    def get_contract_address(self) -> str:
        """Return the configured contract address."""
        return self.contract_address

    def validate_address(self, address: str) -> bool:
        """Validate an Ethereum wallet address."""
        return Web3.is_address(address)

    def checksum_address(self, address: str) -> str:
        """Convert an Ethereum address to checksum format."""
        if not Web3.is_address(address):
            raise ValueError("Invalid Ethereum wallet address")

        return Web3.to_checksum_address(address)

    def get_transaction(self, tx_hash: str) -> Any:
        """Retrieve a blockchain transaction by hash."""
        return self.web3.eth.get_transaction(tx_hash)

    def get_transaction_receipt(self, tx_hash: str) -> Any:
        """Retrieve a transaction receipt by hash."""
        return self.web3.eth.get_transaction_receipt(tx_hash)


blockchain_service = BlockchainService()