from typing import Any

from web3 import Web3
from web3.contract import Contract

from app.config.blockchain import get_contract_address, get_web3
from app.blockchain.contract import get_contract


class BlockchainService:
    def __init__(self) -> None:
        self._web3: Web3 | None = None
        self._contract_address: str | None = None
        self._contract: Contract | None = None

    @property
    def web3(self) -> Web3:
        if self._web3 is None:
            self._web3 = get_web3()
        return self._web3

    @web3.setter
    def web3(self, value: Web3) -> None:
        self._web3 = value

    @property
    def contract_address(self) -> str:
        if self._contract_address is None:
            self._contract_address = get_contract_address()
        return self._contract_address

    @contract_address.setter
    def contract_address(self, value: str) -> None:
        self._contract_address = value

    @property
    def contract(self) -> Contract:
        if self._contract is None:
            self._contract = get_contract()
        return self._contract

    @contract.setter
    def contract(self, value: Contract) -> None:
        self._contract = value

    def is_connected(self) -> bool:
        try:
            return self.web3.is_connected()
        except Exception:
            return False

    def get_chain_id(self) -> int:
        return self.web3.eth.chain_id

    def get_latest_block(self) -> int:
        return self.web3.eth.block_number

    def get_contract_address(self) -> str:
        return self.contract_address

    def validate_address(self, address: str) -> bool:
        return Web3.is_address(address)

    def checksum_address(self, address: str) -> str:
        if not Web3.is_address(address):
            raise ValueError("Invalid Ethereum wallet address")

        return Web3.to_checksum_address(address)

    def get_transaction(self, tx_hash: str) -> Any:
        return self.web3.eth.get_transaction(tx_hash)

    def get_transaction_receipt(self, tx_hash: str) -> Any:
        return self.web3.eth.get_transaction_receipt(tx_hash)

    def get_certificate(self, token_id: int) -> dict[str, Any]:
        if token_id < 1:
            raise ValueError("Token ID must be greater than or equal to 1")

        try:
            certificate = self.contract.functions.getCertificate(
                token_id
            ).call()

            return {
                "recipient": certificate[0],
                "issuer": certificate[1],
                "metadata_cid": certificate[2],
                "issued_at": certificate[3],
                "revoked": certificate[4],
            }

        except Exception as exc:
            raise ValueError(
                f"Unable to retrieve certificate: {exc}"
            ) from exc

    def verify_certificate(self, token_id: int) -> bool:
        if token_id < 1:
            raise ValueError("Token ID must be greater than or equal to 1")

        try:
            return bool(
                self.contract.functions.verifyCertificate(
                    token_id
                ).call()
            )

        except Exception as exc:
            raise ValueError(
                f"Unable to verify certificate: {exc}"
            ) from exc

    def is_authorized_issuer(self, address: str) -> bool:
        checksum_address = self.checksum_address(address)

        try:
            return bool(
                self.contract.functions.authorizedIssuers(
                    checksum_address
                ).call()
            )

        except Exception as exc:
            raise ValueError(
                f"Unable to check issuer authorization: {exc}"
            ) from exc

    def get_certificate_owner(self, token_id: int) -> str:
        if token_id < 1:
            raise ValueError("Token ID must be greater than or equal to 1")

        try:
            owner = self.contract.functions.ownerOf(
                token_id
            ).call()

            return Web3.to_checksum_address(owner)

        except Exception as exc:
            raise ValueError(
                f"Unable to retrieve certificate owner: {exc}"
            ) from exc


blockchain_service = BlockchainService()