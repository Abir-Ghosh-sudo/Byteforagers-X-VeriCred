from fastapi import APIRouter

router = APIRouter(
    prefix="/api/ipfs",
    tags=["IPFS"],
)


@router.get("/{cid}")
async def get_ipfs_metadata(cid: str):
    return {
        "cid": cid,
        "message": "IPFS metadata endpoint ready",
    }