import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "VeriCred API")
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"

    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))

    SEPOLIA_RPC_URL: str = os.getenv("SEPOLIA_RPC_URL", "")
    CHAIN_ID: int = int(os.getenv("CHAIN_ID", "11155111"))

    CONTRACT_ADDRESS: str = os.getenv("CONTRACT_ADDRESS", "")

    IPFS_API_URL: str = os.getenv("IPFS_API_URL", "")
    IPFS_GATEWAY_URL: str = os.getenv(
        "IPFS_GATEWAY_URL",
        "https://ipfs.io/ipfs/",
    )

    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()