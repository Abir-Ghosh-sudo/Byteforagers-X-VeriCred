from fastapi import APIRouter

router = APIRouter(
    prefix="/api/qr",
    tags=["QR"],
)


@router.get("/{token_id}")
async def generate_qr(token_id: int):
    return {
        "token_id": token_id,
        "message": "QR generation endpoint ready",
    }