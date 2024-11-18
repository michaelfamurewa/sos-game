const hre = require("hardhat");


async function main() {
    // Replace this with the actual contract address deployed on the network
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Get the contract ABI (you can find this in the artifacts directory after compiling the contract)
    const sosContract = await hre.ethers.getContractFactory("SOS");

    // Create a contract instance using the address and ABI
    const sos = await sosContract.attach(contractAddress);

    const storedValue = await sos.retrieve();
    console.log("Stored Value:", storedValue.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });