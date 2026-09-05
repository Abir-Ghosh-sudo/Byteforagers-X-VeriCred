const { ethers } = require("hardhat");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  const [admin] = await ethers.getSigners();
  if (!admin) {
    throw new Error("No admin signer wallet found. Check PRIVATE_KEY in .env");
  }

  let contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    const deploymentPath = path.resolve(__dirname, "../deployments/sepolia.json");
    if (fs.existsSync(deploymentPath)) {
      const data = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
      contractAddress = data.contractAddress;
    }
  }

  const issuerAddress = process.env.ISSUER_ADDRESS || admin.address;

  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS is not set in .env or deployments/sepolia.json");
  }

  console.log("Admin:", admin.address);
  console.log("Contract:", contractAddress);
  console.log("Issuer:", issuerAddress);

  const certificate = await ethers.getContractAt(
    "SoulboundCertificate",
    contractAddress
  );

  const currentOwner = await certificate.owner();

  if (currentOwner.toLowerCase() !== admin.address.toLowerCase()) {
    throw new Error(
      `Connected wallet is not the contract owner.\n` +
      `Contract owner: ${currentOwner}\n` +
      `Connected wallet: ${admin.address}`
    );
  }

  const alreadyAuthorized =
    await certificate.authorizedIssuers(issuerAddress);

  if (alreadyAuthorized) {
    console.log("Issuer is already authorized.");
    return;
  }

  console.log("Adding issuer...");

  const tx = await certificate.addIssuer(issuerAddress);

  console.log("Transaction:", tx.hash);

  await tx.wait();

  console.log("Issuer successfully authorized.");

  const status =
    await certificate.authorizedIssuers(issuerAddress);

  console.log("Issuer authorized:", status);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});