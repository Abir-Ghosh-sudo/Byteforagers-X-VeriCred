const { run } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("CONTRACT_ADDRESS is not set");
  }

  console.log("Verifying contract...");
  console.log("Contract:", contractAddress);

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log("Contract verified successfully.");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("Contract is already verified.");
    } else {
      throw error;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});