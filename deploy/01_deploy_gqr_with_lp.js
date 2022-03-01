module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    /*
    let stakedTokenAddress = '';
    let rewardTokenAddress = '';
    let startBlock = ;
    let endBlock = ;
    let lockUpDuration = 7776000;
    let withdrawFee = 500;
    let feeAddress = '';

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
    });

    console.log('GQGalacticReserve deployed at: ', gqGalacticReserve.address);
    
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
    });*/
    
};

module.exports.tags = ['GQGalacticReserveWithLP'];