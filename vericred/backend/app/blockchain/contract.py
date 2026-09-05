import json
from pathlib import Path

from web3.contract import Contract

from app.config.blockchain import get_contract_address, get_web3


ABI_PATH = (
    Path(__file__).resolve().parent
    / "abi"
    / "SoulboundCertificate.json"
)


def load_contract_abi() -> list:
    if not ABI_PATH.exists():
        raise FileNotFoundError(
            f"Contract ABI not found: {ABI_PATH}"
        )

    with ABI_PATH.open("r", encoding="utf-8") as file:
        abi = json.load(file)

    if not isinstance(abi, list):
        raise ValueError("Contract ABI must be a JSON array")

    return abi


def get_contract() -> Contract:
    web3 = get_web3()
    contract_address = get_contract_address()
    abi = load_contract_abi()

    return web3.eth.contract(
        address=contract_address,
        abi=abi,
    )


def get_contract_abi() -> list:
    return load_contract_abi()