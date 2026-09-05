const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying VeriCred Soulbound Certificate contract...");

  const [deployer] = await ethers.getSigners();

  console.log("Deployer:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);

  console.log(
    "Deployer balance:",
    ethers.formatEther(balance),
    "ETH"
  );

  const SoulboundCertificate = await ethers.getContractFactory(
    "SoulboundCertificate"
  );

  const certificate = await SoulboundCertificate.deploy();

  await certificate.waitForDeployment();

  const contractAddress = await certificate.getAddress();

  console.log("\n====================================");
  console.log("VeriCred Contract Deployed");
  console.log("====================================");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log(
    "Chain ID:",
    (await ethers.provider.getNetwork()).chainId.toString()
  );
  console.log("Deployer:", deployer.address);
  console.log("====================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});