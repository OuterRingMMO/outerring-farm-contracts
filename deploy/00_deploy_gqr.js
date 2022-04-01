module.exports = async ({ getNamedAccounts, deployments }) => {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    let stakedTokenAddress = '0x477bC8d23c634C154061869478bce96BE6045D12';
    let rewardTokenAddress = '0xF700D4c708C2be1463E355F337603183D20E0808';
    let startBlock = 16655611;
    let endBlock = 19207611;
    let lockUpDuration = 7776000;
    let withdrawFee = 500;
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