from fastapi import APIRouter

router = APIRouter(
    prefix="/api/issuers",
    tags=["Issuers"],
)


@router.get("/")
async def get_issuers():
    return {
        "issuers": [],
        "message": "Issuer endpoint ready",
    }


@router.get("/{address}")
async def get_issuer(address: str):
    return {
        "address": address,
        "message": "Issuer details endpoint ready",
    }