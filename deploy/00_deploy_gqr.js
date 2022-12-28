module.exports = async ({ getNamedAccounts, deployments }) => {

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    let stakedTokenAddress = '0xcC3A3Bc1d76Df321f94716E88224638C439267aa';
    let rewardTokenAddress = '0x557800E817a46AF24E168B026CfA6064ee93C80D';
    let startBlock = 24325450;
    let endBlock = 29509450;
    let lockUpDuration = 0;
    let withdrawFee = 0;
    let feeAddress = '0xaaf6b6f4c3a20cae39a25fbcd9617822cd8bf1c7';

    const gqGalacticReserve = await deploy('GQGalacticReserve', {
        from: deployer,
        args: [
            stakedTokenAddress,
            rewardTokenAddress,
            startBlock,
            endBlock,
            lockUpDuration,
            withdrawFee,
            feeAddress
        ],
        log: true,
        waitConfirmations: 5
    });

    console.log('GQGalacticReserve deployed at: ', gqGalacticReserve.address);
    await delay(5000);
    // Verification block
    await run("verify:verify", {
        address: gqGalacticReserve.address,
        contract: "contracts/GQGalacticReserve.sol:GQGalacticReserve",
        constructorArguments: [
            stakedTokenAddress,
            rewardTokenAddress,
            startBlock,
            endBlock,
            lockUpDuration,
            withdrawFee,
            feeAddress
        ]
    });

};

module.exports.tags = ['GQGalacticReserve'];