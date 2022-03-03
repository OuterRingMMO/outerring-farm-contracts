module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    let stakedTokenAddress = '0xAC1F5e57d53e9Ac3c092EB876e46C235df95672A';
    let rewardTokenAddress = '0x227a3EF4d41d0215123f3197Faa087Bf71d2236a';
    let startBlock = 15740550;
    let endBlock = 18278000;
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