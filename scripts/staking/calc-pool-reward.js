const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const stakes = require('../../json/stakes.json').stakes;

async function main() {

    owners = await ethers.getSigners();


    for await(let stake of stakes) {
        const gqGalacticReserve = await ethers.getContractAt('GQGalacticReserve', stake);
        const tx = await gqGalacticReserve.poolCalcRewardPerBlock();
        console.log(tx);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });