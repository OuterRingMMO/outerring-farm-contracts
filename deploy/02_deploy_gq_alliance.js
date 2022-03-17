module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    let stakedTokenAddress = '0xe734006Fd9b3C5F1e5cF816C19e63DFAf666514C';
    let rewardToken1Address = '0xEF7d8c89E281f123E14c30868dCdFD59E51EE20F';
    let rewardToken2Address = '0x26D4e2f3943Fe603a8eCEB0A92019A2aAFF220ee';
    let startBlock = 17641564;
    let endBlock = 20233564;
    let lockUpDuration = 2592000;
    let withdrawFee = 500;
    let feeAddress = '0x6080903C0017d0A6cf7C861910Cbc805Ee62740A';

    const gqGalacticAlliance = await deploy('GQGalacticAlliance', {
        from: deployer,
        args: [],
        log: true,
        proxy: {
            proxyContract: 'OpenZeppelinTransparentProxy',
        }
    });

    console.log('GQGalacticAlliance deployed at: ', gqGalacticAlliance.address);
    const GQGalacticAllianceImplementation = await hre.deployments.get('GQGalacticAlliance_Implementation');
    const GQGalacticAllianceDeployed = await ethers.getContractAt('GQGalacticAlliance', GQGalacticAllianceImplementation.address);
    // Verification block
    await run("verify:verify", {
        address: GQGalacticAllianceDeployed.address,
        contract: "contracts/GQGalacticAlliance.sol:GQGalacticAlliance"
    });
    
};

module.exports.tags = ['GQGalacticAlliance'];