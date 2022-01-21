module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    const stakeToken = await deploy('StakeToken', {
        from: deployer,
        args: [],
        log: true,
    });

    console.log('Stake Token deployed at: ', stakeToken.address);

    // Verification block
    await run("verify:verify", {
         address: stakeToken.address,
         contract: "contracts/tokens/StakeToken.sol:StakeToken"
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
         contract: "contracts/tokens/RewardToken.sol:RewardToken"
    });
};

module.exports.tags = ['StakedToken', 'RewardToken'];