import pytest

from app.services.issuer_service import issuer_service


VALID_ADDRESS = "0x0000000000000000000000000000000000000001"


def test_validate_issuer_address():
    result = issuer_service.validate_address(VALID_ADDRESS)

    assert result == VALID_ADDRESS


def test_prepare_issuer_data():
    result = issuer_service.prepare_issuer_data(
        address=VALID_ADDRESS,
        name="Narula Institute of Technology",
        email="issuer@example.com",
    )

    assert result["address"] == VALID_ADDRESS
    assert result["name"] == "Narula Institute of Technology"
    assert result["email"] == "issuer@example.com"


def test_prepare_issuer_data_without_email():
    result = issuer_service.prepare_issuer_data(
        address=VALID_ADDRESS,
        name="VeriCred University",
    )

    assert result["address"] == VALID_ADDRESS
    assert result["name"] == "VeriCred University"
    assert result["email"] is None


def test_prepare_issuer_data_strips_values():
    result = issuer_service.prepare_issuer_data(
        address=VALID_ADDRESS,
        name="  VeriCred University  ",
        email="  issuer@example.com  ",
    )

    assert result["name"] == "VeriCred University"
    assert result["email"] == "issuer@example.com"


def test_invalid_issuer_name():
    with pytest.raises(ValueError, match="Issuer name is required"):
        issuer_service.prepare_issuer_data(
            address=VALID_ADDRESS,
            name="",
        )


def test_build_issuer_response():
    result = issuer_service.build_issuer_response(
        address=VALID_ADDRESS,
        name="VeriCred University",
        authorized=True,
        email="issuer@example.com",
    )

    assert result["address"] == VALID_ADDRESS
    assert result["name"] == "VeriCred University"
    assert result["email"] == "issuer@example.com"
    assert result["authorized"] is True


def test_build_unauthorized_issuer_response():
    result = issuer_service.build_issuer_response(
        address=VALID_ADDRESS,
        name="Unknown Institution",
        authorized=False,
    )

    assert result["address"] == VALID_ADDRESS
    assert result["name"] == "Unknown Institution"
    assert result["email"] is None
    assert result["authorized"] is False


def test_build_issuer_status():
    result = issuer_service.build_issuer_status(
        address=VALID_ADDRESS,
        authorized=True,
    )

    assert result["address"] == VALID_ADDRESS
    assert result["authorized"] is True


def test_is_authorized():
    assert issuer_service.is_authorized(True) is True
    assert issuer_service.is_authorized(False) is False