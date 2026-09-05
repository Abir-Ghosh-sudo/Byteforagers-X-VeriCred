from fastapi import APIRouter, HTTPException

from app.services.issuer_service import issuer_service


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


@router.get("/status")
async def admin_status():
    """
    Return the current admin API status.
    """
    return {
        "status": "ready",
        "message": "Admin endpoint ready",
    }


@router.post("/issuers/{address}")
async def add_issuer(address: str):
    """
    Validate an issuer address before on-chain authorization.

    The actual addIssuer transaction must be executed by the
    contract owner/admin.
    """
    try:
        wallet = issuer_service.validate_address(address)

        return {
            "address": wallet,
            "message": "Issuer authorization request prepared",
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@router.delete("/issuers/{address}")
async def remove_issuer(address: str):
    """
    Validate an issuer address before removing authorization.
    """
    try:
        wallet = issuer_service.validate_address(address)

        return {
            "address": wallet,
            "message": "Issuer removal request prepared",
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc