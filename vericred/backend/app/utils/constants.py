"""
Application-wide constants for VeriCred.
"""

# Blockchain
SEPOLIA_CHAIN_ID = 11155111
ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

# Certificate
MIN_TOKEN_ID = 1

# IPFS
IPFS_SCHEME = "ipfs://"

# API
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8000

# Certificate verification
CERTIFICATE_VALID_MESSAGE = "Certificate is valid."
CERTIFICATE_REVOKED_MESSAGE = "Certificate has been revoked."
CERTIFICATE_NOT_FOUND_MESSAGE = "Certificate not found."

# QR code
QR_IMAGE_FORMAT = "PNG"
QR_DATA_URL_PREFIX = "data:image/png;base64,"

# Date/time
UTC_DATE_FORMAT = "%Y-%m-%d"
UTC_DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S UTC"