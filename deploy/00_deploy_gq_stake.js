module.exports = async ({ getNamedAccounts, deployments }) => {

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    let stakedTokenAddress = '0xF700D4c708C2be1463E355F337603183D20E0808';
    let rewardTokenAddress = '0xF700D4c708C2be1463E355F337603183D20E0808';
    let startBlock = 18275534;
    let endBlock = 23531534;
    let lockUpDuration = 5184000;
    let withdrawFee = 500;
    let feeAddress = '0xaaf6b6f4c3a20cae39a25fbcd9617822cd8bf1c7';

    const gqStake = await deploy('GQStake', {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: 5
    });

    console.log('GQStake deployed at: ', gqStake.address);
    await delay(5000);
    // Verification block
    await run("verify:verify", {
        address: gqStake.address,
        contract: "contracts/GQStake.sol:GQStake"
    });

};

module.exports.tags = ['GQStake'];