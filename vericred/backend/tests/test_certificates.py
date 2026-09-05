from app.services.certificate_service import certificate_service


def test_validate_recipient():
    address = "0x0000000000000000000000000000000000000001"

    result = certificate_service.validate_recipient(address)

    assert result == address


def test_validate_metadata_cid():
    cid = "QmExampleCertificateCID"

    result = certificate_service.validate_metadata_cid(cid)

    assert result == cid


def test_prepare_certificate_data():
    recipient = "0x0000000000000000000000000000000000000001"
    metadata_cid = "QmExampleCertificateCID"

    result = certificate_service.prepare_certificate_data(
        recipient,
        metadata_cid,
    )

    assert result["recipient"] == recipient
    assert result["metadata_cid"] == metadata_cid


def test_format_certificate():
    recipient = "0x0000000000000000000000000000000000000001"
    issuer = "0x0000000000000000000000000000000000000002"

    result = certificate_service.format_certificate(
        token_id=1,
        recipient=recipient,
        issuer=issuer,
        metadata_cid="QmExampleCertificateCID",
        issued_at=1750000000,
        revoked=False,
    )

    assert result["token_id"] == 1
    assert result["recipient"] == recipient
    assert result["issuer"] == issuer
    assert result["metadata_cid"] == "QmExampleCertificateCID"
    assert result["issued_at"] == 1750000000
    assert result["revoked"] is False


def test_certificate_exists():
    assert certificate_service.certificate_exists(1) is True


def test_invalid_token_id_does_not_exist():
    assert certificate_service.certificate_exists(0) is False