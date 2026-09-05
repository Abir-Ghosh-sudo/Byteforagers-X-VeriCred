from pydantic import BaseModel, Field


class CertificateCreate(BaseModel):
    recipient: str = Field(
        ...,
        description="Student wallet address",
    )

    metadata_cid: str = Field(
        ...,
        min_length=1,
        description="IPFS CID containing certificate metadata",
    )


class CertificateResponse(BaseModel):
    token_id: int
    recipient: str
    issuer: str
    metadata_cid: str
    issued_at: int
    revoked: bool


class CertificateVerificationResponse(BaseModel):
    valid: bool
    token_id: int
    recipient: str
    issuer: str
    metadata_cid: str
    issued_at: int
    revoked: bool