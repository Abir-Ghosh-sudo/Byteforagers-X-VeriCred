const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n====================================");
  console.log("Deploying VeriCred Soulbound Certificate contract...");
  console.log("====================================");

  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    console.error("\n❌ Error: No deployer wallet account found!");
    console.error("👉 Please set a valid PRIVATE_KEY in vericred/.env");
    console.error("Example: PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\n");
    process.exitCode = 1;
    return;
  }

  const [deployer] = signers;
  console.log("Deployer Address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  const ethBalance = ethers.formatEther(balance);
  console.log("Deployer Balance:", ethBalance, "ETH");

  if (balance === 0n) {
    console.warn("\n⚠️ Warning: Deployer balance is 0 ETH on Sepolia!");
    console.warn("👉 You need Sepolia Testnet ETH for gas fees.");
    console.warn("Get free faucet ETH at: https://sepoliafaucet.com or https://cloud.google.com/application/web3/faucet/ethereum/sepolia\n");
  }

  const SoulboundCertificate = await ethers.getContractFactory(
    "SoulboundCertificate"
  );

  console.log("Sending deployment transaction...");
  const certificate = await SoulboundCertificate.deploy();
  await certificate.waitForDeployment();

  const contractAddress = await certificate.getAddress();
  const network = await ethers.provider.getNetwork();

  console.log("\n====================================");
  console.log("🎉 VeriCred Contract Deployed Successfully!");
  console.log("====================================");
  console.log("Contract Address :", contractAddress);
  console.log("Network          :", network.name);
  console.log("Chain ID         :", network.chainId.toString());
  console.log("Deployer (Owner) :", deployer.address);
  console.log("====================================\n");

  // Save to deployments/sepolia.json
  const deploymentDir = path.resolve(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentData = {
    network: "sepolia",
    chainId: Number(network.chainId),
    contractName: "SoulboundCertificate",
    contractAddress: contractAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(deploymentDir, "sepolia.json"),
    JSON.stringify(deploymentData, null, 2)
  );
  console.log("💾 Saved deployment info to deployments/sepolia.json");
}

main().catch((error) => {
  console.error("\n❌ Deployment failed:", error);
  process.exitCode = 1;
});