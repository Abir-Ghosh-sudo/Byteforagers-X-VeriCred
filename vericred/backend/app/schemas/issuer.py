from pydantic import BaseModel, Field


class IssuerCreate(BaseModel):
    address: str = Field(
        ...,
        description="Ethereum wallet address of the issuer",
    )

    name: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Name of the issuing organization",
    )

    email: str | None = Field(
        default=None,
        description="Optional issuer contact email",
    )


class IssuerResponse(BaseModel):
    address: str
    name: str
    email: str | None = None
    authorized: bool


class IssuerStatusResponse(BaseModel):
    address: str
    authorized: bool