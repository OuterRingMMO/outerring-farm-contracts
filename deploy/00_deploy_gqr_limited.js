const { parseUnits } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    let stakedTokenAddress = '0x26D4e2f3943Fe603a8eCEB0A92019A2aAFF220ee';
    let rewardTokenAddress = '0xAF517e25f6C80789ED841C4A79E5d7F8803Edf05';
    let startBlock = 21164958;
    let endBlock = 21314958;
    let lockUpDuration = 60;
    let withdrawFee = 500;
    let feeAddress = '0x2aBcbdF5a10082F311D666EC58aD1C90948a2F4a';
    let maxStakeAmount = parseUnits("49000", "ether");

    const gqGalacticReserve = await deploy('GQGalacticReserveLimited', {
        from: deployer,
        args: [
            stakedTokenAddress,
            rewardTokenAddress,
            startBlock,
            endBlock,
            lockUpDuration,
            withdrawFee,
            feeAddress,
            maxStakeAmount
        ],
        log: true,
        waitConfirmations: 5
    });

    console.log('GQGalacticReserveLimited deployed at: ', gqGalacticReserve.address);
    await delay(5000);
    // Verification block
    await run("verify:verify", {
        address: gqGalacticReserve.address,
        contract: "contracts/GQGalacticReserveLimited.sol:GQGalacticReserveLimited",
        constructorArguments: [
            stakedTokenAddress,
            rewardTokenAddress,
            startBlock,
            endBlock,
            lockUpDuration,
            withdrawFee,
            feeAddress,
            maxStakeAmount
        ]
    });

};

module.exports.tags = ['GQGalacticReserveLimited'];