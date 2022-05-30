module.exports = async ({ getNamedAccounts, deployments }) => {

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    let stakedTokenAddress = '0xF700D4c708C2be1463E355F337603183D20E0808';
    let rewardTokenAddress = '0x0EFCF1737b81CE89325b17EafAe2686A8aFE8bD4';
    let startBlock = 18275534;
    let endBlock = 23531534;
    let lockUpDuration = 5184000;
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