from fastapi import APIRouter, HTTPException

from app.schemas.qr import QRCodeRequest, QRCodeResponse
from app.services.qr_service import qr_service


router = APIRouter(
    prefix="/api/qr",
    tags=["QR"],
)


@router.get("/{token_id}")
async def generate_qr(token_id: int):
    """
    Generate a QR code for public certificate verification.
    """
    try:
        verification_url = qr_service.build_verification_url(
            base_url="http://localhost:5173",
            token_id=token_id,
        )

        qr_code = qr_service.generate_qr_data_url(
            verification_url
        )

        return QRCodeResponse(
            token_id=token_id,
            verification_url=verification_url,
            qr_code=qr_code,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


@router.post("/")
async def create_qr(request: QRCodeRequest):
    """
    Generate a QR code from a supplied verification URL.
    """
    try:
        qr_code = qr_service.generate_qr_data_url(
            request.verification_url
        )

        return QRCodeResponse(
            token_id=request.token_id,
            verification_url=request.verification_url,
            qr_code=qr_code,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc