from datetime import datetime, timezone


def current_timestamp() -> int:
    """Return the current UTC Unix timestamp."""
    return int(datetime.now(timezone.utc).timestamp())


def timestamp_to_datetime(timestamp: int) -> datetime:
    """Convert a Unix timestamp to a UTC datetime."""
    if timestamp < 0:
        raise ValueError("Timestamp cannot be negative")

    return datetime.fromtimestamp(
        timestamp,
        tz=timezone.utc,
    )


def datetime_to_timestamp(value: datetime) -> int:
    """Convert a datetime to a Unix timestamp."""
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)

    return int(value.timestamp())


def format_timestamp(
    timestamp: int,
    date_format: str = "%Y-%m-%d %H:%M:%S UTC",
) -> str:
    """Format a Unix timestamp as a readable date string."""
    return timestamp_to_datetime(timestamp).strftime(date_format)


def is_valid_timestamp(timestamp: int) -> bool:
    """Check whether a value is a valid Unix timestamp."""
    return isinstance(timestamp, int) and timestamp >= 0