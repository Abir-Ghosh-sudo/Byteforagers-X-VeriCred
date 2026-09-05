from typing import Any

import httpx

from app.config.ipfs import get_ipfs_gateway_url
from app.config.settings import settings


class IPFSService:
    """
    Service responsible for interacting with IPFS metadata.
    """

    def __init__(self) -> None:
        self.api_url = settings.IPFS_API_URL
        self.gateway_url = settings.IPFS_GATEWAY_URL

    def build_gateway_url(self, cid: str) -> str:
        """Build a public IPFS gateway URL from a CID."""
        return get_ipfs_gateway_url(cid)

    async def fetch_metadata(self, cid: str) -> dict[str, Any]:
        """
        Fetch JSON certificate metadata from an IPFS gateway.
        """
        if not cid or not cid.strip():
            raise ValueError("IPFS CID is required")

        url = self.build_gateway_url(cid.strip())

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url)
            response.raise_for_status()

            data = response.json()

        if not isinstance(data, dict):
            raise ValueError("IPFS metadata must be a JSON object")

        return data

    def build_metadata(
        self,
        name: str,
        course: str,
        date: str,
        issuer: str,
    ) -> dict[str, str]:
        """
        Prepare certificate metadata before uploading it to IPFS.
        """
        if not name.strip():
            raise ValueError("Certificate holder name is required")

        if not course.strip():
            raise ValueError("Course name is required")

        if not date.strip():
            raise ValueError("Certificate date is required")

        if not issuer.strip():
            raise ValueError("Issuer name is required")

        return {
            "name": name.strip(),
            "course": course.strip(),
            "date": date.strip(),
            "issuer": issuer.strip(),
        }


ipfs_service = IPFSService()