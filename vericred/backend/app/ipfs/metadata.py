from typing import Any

from app.services.ipfs_service import ipfs_service


class MetadataManager:
    """
    Manages certificate metadata before and after IPFS storage.
    """

    REQUIRED_FIELDS = {
        "name",
        "course",
        "date",
        "issuer",
    }

    def validate(self, metadata: dict[str, Any]) -> bool:
        """Validate the required certificate metadata fields."""
        if not isinstance(metadata, dict):
            raise ValueError("Metadata must be a JSON object")

        missing_fields = self.REQUIRED_FIELDS - metadata.keys()

        if missing_fields:
            raise ValueError(
                "Missing metadata fields: "
                + ", ".join(sorted(missing_fields))
            )

        for field in self.REQUIRED_FIELDS:
            value = metadata.get(field)

            if not isinstance(value, str) or not value.strip():
                raise ValueError(
                    f"Metadata field '{field}' must be a non-empty string"
                )

        return True

    def prepare(
        self,
        name: str,
        course: str,
        date: str,
        issuer: str,
    ) -> dict[str, str]:
        """Create and validate certificate metadata."""
        metadata = ipfs_service.build_metadata(
            name=name,
            course=course,
            date=date,
            issuer=issuer,
        )

        self.validate(metadata)

        return metadata

    def normalize(self, metadata: dict[str, Any]) -> dict[str, Any]:
        """Normalize metadata string values."""
        self.validate(metadata)

        normalized = dict(metadata)

        for field in self.REQUIRED_FIELDS:
            normalized[field] = normalized[field].strip()

        return normalized


metadata_manager = MetadataManager()