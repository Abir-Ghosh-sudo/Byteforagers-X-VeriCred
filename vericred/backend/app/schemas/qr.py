from pydantic import BaseModel, Field


class QRCodeRequest(BaseModel):
    token_id: int = Field(
        ...,
        ge=1,
        description="Certificate token ID",
    )

    verification_url: str = Field(
        ...,
        min_length=1,
        description="Public certificate verification URL",
    )


class QRCodeResponse(BaseModel):
    token_id: int
    verification_url: str
    qr_code: str