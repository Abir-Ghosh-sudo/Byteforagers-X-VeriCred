const { ethers } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const issuerAddress = process.env.ISSUER_ADDRESS;

  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS is not set");
  }

  if (!issuerAddress) {
    throw new Error("ISSUER_ADDRESS is not set");
  }

  const [admin] = await ethers.getSigners();

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