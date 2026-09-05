import io
from datetime import datetime
from typing import Any

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


class PDFService:
    """
    Service responsible for generating a basic PDF certificate.
    """

    def generate_certificate_pdf(
        self,
        certificate: dict[str, Any],
    ) -> bytes:
        """
        Generate a PDF certificate from certificate information.
        """

        required_fields = [
            "token_id",
            "recipient",
            "issuer",
            "metadata_cid",
            "issued_at",
        ]

        for field in required_fields:
            if field not in certificate:
                raise ValueError(f"Missing certificate field: {field}")

        buffer = io.BytesIO()

        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=20 * mm,
            leftMargin=20 * mm,
            topMargin=20 * mm,
            bottomMargin=20 * mm,
        )

        styles = getSampleStyleSheet()

        title_style = styles["Title"]
        heading_style = styles["Heading2"]
        body_style = styles["BodyText"]

        story = []

        story.append(
            Paragraph("VeriCred", title_style)
        )

        story.append(
            Paragraph(
                "On-Chain Verifiable Certificate",
                heading_style,
            )
        )

        story.append(Spacer(1, 15 * mm))

        story.append(
            Paragraph(
                "<b>Certificate Token ID:</b> "
                f"{certificate['token_id']}",
                body_style,
            )
        )

        story.append(
            Paragraph(
                "<b>Recipient Wallet:</b> "
                f"{certificate['recipient']}",
                body_style,
            )
        )

        story.append(
            Paragraph(
                "<b>Issuer Wallet:</b> "
                f"{certificate['issuer']}",
                body_style,
            )
        )

        story.append(
            Paragraph(
                "<b>IPFS Metadata CID:</b> "
                f"{certificate['metadata_cid']}",
                body_style,
            )
        )

        issued_at = certificate["issued_at"]

        try:
            issued_date = datetime.fromtimestamp(
                int(issued_at)
            ).strftime("%Y-%m-%d %H:%M:%S")
        except (TypeError, ValueError, OSError):
            issued_date = str(issued_at)

        story.append(
            Paragraph(
                "<b>Issued At:</b> "
                f"{issued_date}",
                body_style,
            )
        )

        story.append(Spacer(1, 10 * mm))

        revoked = certificate.get("revoked", False)

        status = "REVOKED" if revoked else "VALID"

        story.append(
            Paragraph(
                f"<b>Status:</b> {status}",
                heading_style,
            )
        )

        story.append(Spacer(1, 15 * mm))

        story.append(
            Paragraph(
                "This certificate contains blockchain-referenced "
                "credential information. Its authenticity can be "
                "verified using the certificate token ID and the "
                "VeriCred verification system.",
                body_style,
            )
        )

        document.build(story)

        return buffer.getvalue()


pdf_service = PDFService()