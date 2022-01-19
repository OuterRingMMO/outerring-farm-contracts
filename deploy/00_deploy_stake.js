module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    const stake = await deploy('Stake', {
        from: deployer,
        args: [],
        log: true,
    });

    console.log('Stake deployed at: ', stake.address);

    // Verification block
    await run("verify:verify", {
         address: stake.address,
    });
};

module.exports.tags = ['Stake'];