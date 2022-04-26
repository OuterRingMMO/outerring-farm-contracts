module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const galacticFarming = await deploy('GalacticFarming', {
        from: deployer,
        args: [],
        log: true,
        proxy: {
            proxyContract: 'OpenZeppelinTransparentProxy',
        }
    });

    console.log('GalacticFarming deployed at: ', galacticFarming.address);
    
    const galacticFarmingImplementation = await hre.deployments.get('GalacticFarming_Implementation');
    const galacticFarmingDeployed = await ethers.getContractAt('GalacticFarming', galacticFarmingImplementation.address);
    // Verification block
    await run("verify:verify", {
        address: galacticFarmingDeployed.address,
        contract: "contracts/GalacticFarming.sol:GalacticFarming"
    });
};

module.exports.tags = ['GalacticFarming'];