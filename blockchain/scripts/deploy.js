const { ethers } = require("hardhat");

async function main() {
    const SoS = await ethers.getContractFactory("SOS");
    const sos = await SoS.deploy();

    await sos.waitForDeployment()
    console.log("SOS contract deployed to:", await sos.getAddress());
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
