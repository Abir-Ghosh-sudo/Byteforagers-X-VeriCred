from pydantic import BaseModel, Field


class VerificationRequest(BaseModel):
    token_id: int = Field(
        ...,
        ge=1,
        description="Certificate token ID",
    )


class WalletVerificationRequest(BaseModel):
    address: str = Field(
        ...,
        description="Student wallet address",
    )


class VerificationResponse(BaseModel):
    valid: bool
    token_id: int
    recipient: str
    issuer: str
    metadata_cid: str
    issued_at: int
    revoked: bool
    message: str