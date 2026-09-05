from fastapi import APIRouter, HTTPException

from app.schemas.issuer import IssuerCreate
from app.services.issuer_service import issuer_service


router = APIRouter(
    prefix="/api/issuers",
    tags=["Issuers"],
)


@router.get("/")
async def get_issuers():
    """
    Return the list of registered issuers.

    Persistent issuer storage will be connected through
    IssuerRepository.
    """
    return {
        "issuers": [],
        "message": "Issuer list endpoint ready",
    }


@router.get("/{address}")
async def get_issuer(address: str):
    """
    Validate and retrieve issuer information by wallet address.
    """
    try:
        wallet = issuer_service.validate_address(address)

        return {
            "address": wallet,
            "message": "Issuer lookup endpoint ready",
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@router.post("/")
async def create_issuer(issuer: IssuerCreate):
    """
    Validate and prepare issuer information.

    Actual on-chain authorization is performed by the
    contract owner/admin.
    """
    try:
        issuer_data = issuer_service.prepare_issuer_data(
            address=issuer.address,
            name=issuer.name,
            email=issuer.email,
        )

        return {
            "message": "Issuer data prepared successfully",
            "issuer": issuer_data,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc