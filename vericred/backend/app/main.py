from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    admin,
    certificates,
    issuers,
    ipfs,
    qr,
    verification,
)
from app.config.settings import settings


app = FastAPI(
    title="VeriCred API",
    description="Backend API for on-chain verifiable credentials.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(certificates.router)
app.include_router(verification.router)
app.include_router(issuers.router)
app.include_router(admin.router)
app.include_router(ipfs.router)
app.include_router(qr.router)


@app.get("/")
async def root():
    return {
        "name": "VeriCred API",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }