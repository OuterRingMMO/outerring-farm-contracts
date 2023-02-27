module.exports = async ({ getNamedAccounts, deployments }) => {

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    let stakedTokenAddress = '0xAC1F5e57d53e9Ac3c092EB876e46C235df95672A';
    let rewardTokenAddress = '0x227a3ef4d41d0215123f3197faa087bf71d2236a';
    let startBlock = 26047700;
    let endBlock = 31231700;
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
        waitConfirmations: 10
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