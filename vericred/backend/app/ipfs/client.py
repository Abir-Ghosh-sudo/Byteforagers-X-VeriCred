from typing import Any

import httpx

from app.config.ipfs import IPFS_API_URL


class IPFSClient:
    """
    Low-level client for interacting with an IPFS HTTP API.
    """

    def __init__(self) -> None:
        self.api_url = IPFS_API_URL.rstrip("/") if IPFS_API_URL else ""

    def is_configured(self) -> bool:
        """Check whether an IPFS API endpoint is configured."""
        return bool(self.api_url)

    async def upload_json(
        self,
        data: dict[str, Any],
    ) -> str:
        """
        Upload JSON metadata to the configured IPFS API.

        Returns the IPFS CID.
        """
        if not self.is_configured():
            raise RuntimeError("IPFS_API_URL is not configured")

        if not isinstance(data, dict):
            raise ValueError("IPFS metadata must be a JSON object")

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                self.api_url,
                json=data,
            )

            response.raise_for_status()

        result = response.json()

        # Support common IPFS API response formats.
        cid = (
            result.get("Hash")
            or result.get("cid")
            or result.get("Cid")
        )

        if not cid:
            raise ValueError(
                "IPFS API response did not contain a CID"
            )

        return str(cid)

    async def upload_file(
        self,
        file_content: bytes,
        filename: str,
    ) -> str:
        """
        Upload a file to the configured IPFS API.

        Returns the IPFS CID.
        """
        if not self.is_configured():
            raise RuntimeError("IPFS_API_URL is not configured")

        if not file_content:
            raise ValueError("File content cannot be empty")

        if not filename.strip():
            raise ValueError("Filename is required")

        files = {
            "file": (
                filename,
                file_content,
                "application/octet-stream",
            )
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                self.api_url,
                files=files,
            )

            response.raise_for_status()

        result = response.json()

        cid = (
            result.get("Hash")
            or result.get("cid")
            or result.get("Cid")
        )

        if not cid:
            raise ValueError(
                "IPFS API response did not contain a CID"
            )

        return str(cid)


ipfs_client = IPFSClient()