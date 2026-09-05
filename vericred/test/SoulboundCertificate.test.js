const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SoulboundCertificate", function () {
  let certificate;
  let owner;
  let issuer;
  let student;
  let anotherUser;

  beforeEach(async function () {
    [owner, issuer, student, anotherUser] = await ethers.getSigners();

    const SoulboundCertificate = await ethers.getContractFactory(
      "SoulboundCertificate"
    );

    certificate = await SoulboundCertificate.deploy();

    await certificate.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await certificate.owner()).to.equal(owner.address);
    });

    it("should use the correct token name and symbol", async function () {
      expect(await certificate.name()).to.equal("VeriCred Certificate");
      expect(await certificate.symbol()).to.equal("VCERT");
    });
  });

  describe("Issuer Management", function () {
    it("should allow owner to add an issuer", async function () {
      await expect(certificate.addIssuer(issuer.address))
        .to.emit(certificate, "IssuerAdded")
        .withArgs(issuer.address);

      expect(
        await certificate.authorizedIssuers(issuer.address)
      ).to.equal(true);
    });

    it("should allow owner to remove an issuer", async function () {
      await certificate.addIssuer(issuer.address);
      await certificate.removeIssuer(issuer.address);

      expect(
        await certificate.authorizedIssuers(issuer.address)
      ).to.equal(false);
    });

    it("should not allow non-owner to add an issuer", async function () {
      await expect(
        certificate.connect(issuer).addIssuer(anotherUser.address)
      ).to.be.revertedWithCustomError(
        certificate,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Certificate Minting", function () {
    beforeEach(async function () {
      await certificate.addIssuer(issuer.address);
    });

    it("should allow an authorized issuer to mint", async function () {
      await expect(
        certificate
          .connect(issuer)
          .mintCertificate(student.address, "QmTestCertificateCID")
      )
        .to.emit(certificate, "CertificateIssued")
        .withArgs(
          1,
          student.address,
          issuer.address,
          "QmTestCertificateCID",
          await getBlockTimestamp()
        );
    });

    it("should assign the certificate to the student", async function () {
      await certificate
        .connect(issuer)
        .mintCertificate(student.address, "QmTestCertificateCID");

      expect(await certificate.ownerOf(1)).to.equal(student.address);
    });

    it("should store certificate information", async function () {
      await certificate
        .connect(issuer)
        .mintCertificate(student.address, "QmTestCertificateCID");

      const cert = await certificate.getCertificate(1);

      expect(cert.tokenId).to.equal(1);
      expect(cert.recipient).to.equal(student.address);
      expect(cert.issuer).to.equal(issuer.address);
      expect(cert.metadataCID).to.equal("QmTestCertificateCID");
      expect(cert.revoked).to.equal(false);
    });

    it("should reject unauthorized issuers", async function () {
      await expect(
        certificate
          .connect(anotherUser)
          .mintCertificate(student.address, "QmTestCertificateCID")
      ).to.be.revertedWith("Not an authorized issuer");
    });

    it("should reject an invalid recipient", async function () {
      await expect(
        certificate
          .connect(issuer)
          .mintCertificate(ethers.ZeroAddress, "QmTestCertificateCID")
      ).to.be.revertedWith("Invalid recipient");
    });

    it("should reject empty metadata CID", async function () {
      await expect(
        certificate
          .connect(issuer)
          .mintCertificate(student.address, "")
      ).to.be.revertedWith("Metadata CID required");
    });
  });

  describe("Soulbound Protection", function () {
    beforeEach(async function () {
      await certificate.addIssuer(issuer.address);

      await certificate
        .connect(issuer)
        .mintCertificate(student.address, "QmTestCertificateCID");
    });

    it("should prevent certificate transfers", async function () {
      await expect(
        certificate
          .connect(student)
          .transferFrom(student.address, anotherUser.address, 1)
      ).to.be.revertedWith("Soulbound: transfer disabled");
    });

    it("should prevent safe certificate transfers", async function () {
      await expect(
        certificate
          .connect(student)
          ["safeTransferFrom(address,address,uint256)"](
            student.address,
            anotherUser.address,
            1
          )
      ).to.be.revertedWith("Soulbound: transfer disabled");
    });
  });

  describe("Verification", function () {
    beforeEach(async function () {
      await certificate.addIssuer(issuer.address);

      await certificate
        .connect(issuer)
        .mintCertificate(student.address, "QmTestCertificateCID");
    });

    it("should verify a valid certificate", async function () {
      const result = await certificate.verifyCertificate(1);

      expect(result.valid).to.equal(true);
      expect(result.recipient).to.equal(student.address);
      expect(result.issuer).to.equal(issuer.address);
      expect(result.metadataCID).to.equal("QmTestCertificateCID");
      expect(result.revoked).to.equal(false);
    });

    it("should return the correct IPFS token URI", async function () {
      expect(await certificate.tokenURI(1)).to.equal(
        "ipfs://QmTestCertificateCID"
      );
    });
  });

  describe("Revocation", function () {
    beforeEach(async function () {
      await certificate.addIssuer(issuer.address);

      await certificate
        .connect(issuer)
        .mintCertificate(student.address, "QmTestCertificateCID");
    });

    it("should allow the issuer to revoke a certificate", async function () {
      await expect(
        certificate.connect(issuer).revokeCertificate(1)
      )
        .to.emit(certificate, "CertificateRevoked")
        .withArgs(1, issuer.address);

      const result = await certificate.verifyCertificate(1);

      expect(result.valid).to.equal(false);
      expect(result.revoked).to.equal(true);
    });

    it("should allow the owner to revoke a certificate", async function () {
      await certificate.connect(owner).revokeCertificate(1);

      const result = await certificate.verifyCertificate(1);

      expect(result.valid).to.equal(false);
      expect(result.revoked).to.equal(true);
    });

    it("should not allow another user to revoke", async function () {
      await expect(
        certificate.connect(anotherUser).revokeCertificate(1)
      ).to.be.revertedWith("Not authorized to revoke");
    });
  });

  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp + 1;
  }
});