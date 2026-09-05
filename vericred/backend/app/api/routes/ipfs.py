from fastapi import APIRouter, HTTPException

from app.services.ipfs_service import ipfs_service


router = APIRouter(
    prefix="/api/ipfs",
    tags=["IPFS"],
)


@router.get("/{cid}")
async def get_ipfs_metadata(cid: str):
    """
    Fetch certificate metadata from IPFS using its CID.
    """
    try:
        metadata = await ipfs_service.fetch_metadata(cid)

        return {
            "cid": cid,
            "metadata": metadata,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to fetch IPFS metadata: {exc}",
        ) from exc