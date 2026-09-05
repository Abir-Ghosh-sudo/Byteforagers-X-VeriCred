import base64
import io

import qrcode


class QRService:
    """
    Service responsible for generating QR codes
    for public certificate verification.
    """

    def build_verification_url(
        self,
        base_url: str,
        token_id: int,
    ) -> str:
        """Build the public verification URL for a certificate."""
        if token_id < 1:
            raise ValueError("Token ID must be greater than or equal to 1")

        if not base_url or not base_url.strip():
            raise ValueError("Base URL is required")

        return f"{base_url.rstrip('/')}/verify/{token_id}"

    def generate_qr_base64(self, verification_url: str) -> str:
        """
        Generate a QR code and return it as a Base64-encoded PNG.
        """
        if not verification_url or not verification_url.strip():
            raise ValueError("Verification URL is required")

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=4,
        )

        qr.add_data(verification_url.strip())
        qr.make(fit=True)

        image = qr.make_image()

        buffer = io.BytesIO()
        image.save(buffer, format="PNG")

        encoded_image = base64.b64encode(
            buffer.getvalue()
        ).decode("utf-8")

        return encoded_image

    def generate_qr_data_url(self, verification_url: str) -> str:
        """Generate a browser-ready QR code data URL."""
        encoded_image = self.generate_qr_base64(verification_url)

        return f"data:image/png;base64,{encoded_image}"


qr_service = QRService()