module.exports = async ({ getNamedAccounts, deployments }) => {
    
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    let stakedTokenAddress = '0x6116D1eaD7CF92c5beD0Ae6A0e5d7e501149E102';
    let rewardTokenAddress = '0x26D4e2f3943Fe603a8eCEB0A92019A2aAFF220ee';
    let startBlock = 17837022;
    let endBlock = 20429022;
    let lockUpDuration = 2592000;
    let withdrawFee = 500;
    let feeAddress = '0x6080903C0017d0A6cf7C861910Cbc805Ee62740A';

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