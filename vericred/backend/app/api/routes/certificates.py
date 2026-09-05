from fastapi import APIRouter

router = APIRouter(
    prefix="/api/certificates",
    tags=["Certificates"],
)


@router.get("/{token_id}")
async def get_certificate(token_id: int):
    return {
        "token_id": token_id,
        "message": "Certificate endpoint ready",
    }