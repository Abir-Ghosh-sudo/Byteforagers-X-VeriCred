from fastapi import APIRouter, HTTPException

from app.schemas.certificate import (
    CertificateCreate,
    CertificateResponse,
)
from app.services.certificate_service import certificate_service


router = APIRouter(
    prefix="/api/certificates",
    tags=["Certificates"],
)


@router.get(
    "/{token_id}",
    response_model=CertificateResponse,
)
async def get_certificate(token_id: int):
    """
    Retrieve a certificate directly from the blockchain.
    """
    try:
        certificate = certificate_service.get_certificate(token_id)

        return certificate

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


@router.post("/")
async def prepare_certificate(
    certificate: CertificateCreate,
):
    """
    Validate and prepare certificate data before minting.

    The actual mint transaction is signed by the authorized
    issuer through the frontend wallet.
    """
    try:
        certificate_data = (
            certificate_service.prepare_certificate_data(
                recipient=certificate.recipient,
                metadata_cid=certificate.metadata_cid,
            )
        )

        return {
            "message": "Certificate data prepared successfully",
            "certificate": certificate_data,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@router.get("/{token_id}/owner")
async def get_certificate_owner(token_id: int):
    """
    Return the wallet currently holding the soulbound certificate.
    """
    try:
        owner = certificate_service.get_certificate_owner(
            token_id
        )

        return {
            "token_id": token_id,
            "owner": owner,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc