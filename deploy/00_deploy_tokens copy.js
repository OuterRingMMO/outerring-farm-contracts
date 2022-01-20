module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    const stakedToken = await deploy('StakedToken', {
        from: deployer,
        args: [],
        log: true,
    });

    console.log('Staked Token deployed at: ', stakedToken.address);

    // Verification block
    await run("verify:verify", {
         address: stakedToken.address,
    });

    const rewardToken = await deploy('RewardToken', {
        from: deployer,
        args: [],
        log: true,
    });

    console.log('Reward Token deployed at: ', rewardToken.address);

    // Verification block
    await run("verify:verify", {
         address: rewardToken.address,
    });
};

module.exports.tags = ['StakedToken', 'RewardToken'];