from fastapi import APIRouter

router = APIRouter(
    prefix="/api/verify",
    tags=["Verification"],
)


@router.get("/{token_id}")
async def verify_certificate(token_id: int):
    return {
        "token_id": token_id,
        "message": "Certificate verification endpoint ready",
    }


@router.get("/wallet/{address}")
async def verify_wallet(address: str):
    return {
        "wallet": address,
        "message": "Wallet verification endpoint ready",
    }