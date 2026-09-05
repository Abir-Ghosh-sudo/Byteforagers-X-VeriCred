import pytest

from app.services.verification_service import verification_service


VALID_ADDRESS = "0x0000000000000000000000000000000000000001"
ISSUER_ADDRESS = "0x0000000000000000000000000000000000000002"
METADATA_CID = "QmExampleCertificateCID"


def test_validate_token_id():
    result = verification_service.validate_token_id(1)

    assert result == 1


def test_invalid_token_id():
    with pytest.raises(ValueError, match="Token ID"):
        verification_service.validate_token_id(0)


def test_validate_wallet_address():
    result = verification_service.validate_wallet_address(VALID_ADDRESS)

    assert result == VALID_ADDRESS


def test_build_verification_response():
    result = verification_service.build_verification_response(
        valid=True,
        token_id=1,
        recipient=VALID_ADDRESS,
        issuer=ISSUER_ADDRESS,
        metadata_cid=METADATA_CID,
        issued_at=1750000000,
        revoked=False,
        message="Certificate is valid.",
    )

    assert result["valid"] is True
    assert result["token_id"] == 1
    assert result["recipient"] == VALID_ADDRESS
    assert result["issuer"] == ISSUER_ADDRESS
    assert result["metadata_cid"] == METADATA_CID
    assert result["issued_at"] == 1750000000
    assert result["revoked"] is False
    assert result["message"] == "Certificate is valid."


def test_valid_certificate():
    result = verification_service.is_certificate_valid(
        token_id=1,
        revoked=False,
    )

    assert result is True


def test_revoked_certificate():
    result = verification_service.is_certificate_valid(
        token_id=1,
        revoked=True,
    )

    assert result is False


def test_verify_certificate_data_for_valid_certificate():
    result = verification_service.verify_certificate_data(
        token_id=1,
        recipient=VALID_ADDRESS,
        issuer=ISSUER_ADDRESS,
        metadata_cid=METADATA_CID,
        issued_at=1750000000,
        revoked=False,
    )

    assert result["valid"] is True
    assert result["token_id"] == 1
    assert result["revoked"] is False
    assert result["message"] == "Certificate is valid."


def test_verify_certificate_data_for_revoked_certificate():
    result = verification_service.verify_certificate_data(
        token_id=1,
        recipient=VALID_ADDRESS,
        issuer=ISSUER_ADDRESS,
        metadata_cid=METADATA_CID,
        issued_at=1750000000,
        revoked=True,
    )

    assert result["valid"] is False
    assert result["revoked"] is True
    assert result["message"] == "Certificate has been revoked."