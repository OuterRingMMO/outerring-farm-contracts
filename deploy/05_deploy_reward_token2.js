module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const gqGalacticAlliance = await deploy('RewardToken', {
        from: deployer,
        args: ["Reward Token 2", "RT2"],
        log: true
    });

    console.log('RewardToken2 deployed at: ', gqGalacticAlliance.address);
    /*
    // Verification block
    await run("verify:verify", {
        address: gqGalacticAlliance.address,
        contract: "contracts/GQGalacticAlliance.sol:GQGalacticAlliance"
    });
    */
};

module.exports.tags = ['RewardToken2'];