module.exports = async ({ getNamedAccounts, deployments }) => {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    let stakedTokenAddress = '0xF700D4c708C2be1463E355F337603183D20E0808';
    let rewardTokenAddress = '0x227a3EF4d41d0215123f3197Faa087Bf71d2236a';
    let startBlock = 15740550;
    let endBlock = 18278000;
    let lockUpDuration = 7776000;
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
        waitConfirmations: 5
    });

    console.log('GQGalacticReserve deployed at: ', gqGalacticReserve.address);
    sleep(5000);
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