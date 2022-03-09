module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    let stakedTokenAddress = '';
    let rewardTokenAddress = '0x227a3EF4d41d0215123f3197Faa087Bf71d2236a';
    let startBlock = 15912600;
    let endBlock = 18520000;
    let lockUpDuration = 2592000;
    let withdrawFee = 500;
    let feeAddress = '0xaAF6B6f4c3a20cae39A25fBcD9617822cd8bf1C7';

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

module.exports.tags = ['GQGalacticReserveWithLP'];