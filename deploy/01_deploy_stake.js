module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    const stakedToken = "";
    const rewardToken = "";
    const rewardPerBlock = "";
    const startBlock = ;
    const endBlock = ;
    const lockUpDuration = ;
    const withdrawFee = ;
    const feeAddress = "";

    const stake = await deploy('Stake', {
        from: deployer,
        args: [stakedToken, rewardToken, startBlock, endBlock, lockUpDuration, withdrawFee, feeAddress],
        log: true,
    });

    console.log('Stake deployed at: ', stake.address);

    // Verification block
    await run("verify:verify", {
         address: stake.address,
    });
};

module.exports.tags = ['Stake'];