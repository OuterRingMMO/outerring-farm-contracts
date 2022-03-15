module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const gqGalacticAlliance = await deploy('StakeToken', {
        from: deployer,
        args: [],
        log: true
    });

    console.log('StakeToken deployed at: ', gqGalacticAlliance.address);
    /*
    // Verification block
    await run("verify:verify", {
        address: gqGalacticAlliance.address,
        contract: "contracts/GQGalacticAlliance.sol:GQGalacticAlliance"
    });
    */
};

module.exports.tags = ['StakeToken'];