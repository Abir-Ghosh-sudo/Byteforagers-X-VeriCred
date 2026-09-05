from app.config.settings import settings


IPFS_API_URL = settings.IPFS_API_URL
IPFS_GATEWAY_URL = settings.IPFS_GATEWAY_URL


def get_ipfs_gateway_url(cid: str) -> str:
    if not cid:
        raise ValueError("IPFS CID is required")

    gateway = IPFS_GATEWAY_URL.rstrip("/") + "/"

    return f"{gateway}{cid}"