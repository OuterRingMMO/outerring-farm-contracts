module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    let stakedTokenAddress = '0xAF0946EB2217cD93060C1712708a333A649ab94A';
    let rewardTokenAddress = '0xBF27fe9a847bF9F6A20D686c3C000e468146473c';
    let startBlock = 17005327;
    let endBlock = 19633327;
    let lockUpDuration = 7776000;
    let withdrawFee = 500;
    let feeAddress = '0x225D87f62928160CE060Bb0c119FC0Eb550d41E9';

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
    });
    
};

module.exports.tags = ['GQGalacticReserve'];