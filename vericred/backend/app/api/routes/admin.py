from fastapi import APIRouter

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


@router.get("/status")
async def admin_status():
    return {
        "status": "ready",
        "message": "Admin endpoint ready",
    }


@router.post("/issuers/{address}")
async def add_issuer(address: str):
    return {
        "address": address,
        "message": "Issuer authorization endpoint ready",
    }


@router.delete("/issuers/{address}")
async def remove_issuer(address: str):
    return {
        "address": address,
        "message": "Issuer removal endpoint ready",
    }