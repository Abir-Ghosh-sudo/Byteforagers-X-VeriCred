from fastapi import APIRouter, HTTPException

from app.schemas.verification import (
    VerificationRequest,
    VerificationResponse,
    WalletVerificationRequest,
)
from app.services.verification_service import verification_service


router = APIRouter(
    prefix="/api/verify",
    tags=["Verification"],
)


@router.get(
    "/{token_id}",
    response_model=VerificationResponse,
)
async def verify_certificate(token_id: int):
    """
    Verify a certificate directly against the blockchain.
    """
    try:
        result = verification_service.verify_certificate(
            token_id
        )

        return result

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


@router.post(
    "/",
    response_model=VerificationResponse,
)
async def verify_certificate_request(
    request: VerificationRequest,
):
    """
    Verify a certificate using its token ID.
    """
    try:
        result = verification_service.verify_certificate(
            request.token_id
        )

        return result

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


@router.get("/wallet/{address}")
async def verify_wallet(address: str):
    """
    Validate a wallet and check whether it is connected
    to a certificate holder.
    """
    try:
        result = verification_service.verify_wallet(address)

        return result

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@router.post("/wallet")
async def verify_wallet_request(
    request: WalletVerificationRequest,
):
    """
    Validate a wallet address supplied in a request body.
    """
    try:
        result = verification_service.verify_wallet(
            request.address
        )

        return result

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc