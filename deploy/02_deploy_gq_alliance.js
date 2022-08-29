module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    let stakedTokenAddress = '0xAC1F5e57d53e9Ac3c092EB876e46C235df95672A';
    let rewardToken1Address = '0xF700D4c708C2be1463E355F337603183D20E0808';
    let rewardToken2Address = '0x07958Be5D12365db62a6535D0a88105944a2E81E';
    let startBlock = 20863700;
    let endBlock = 26047700;
    let lockUpDuration = 2592000;
    let withdrawFee = 500;
    let feeAddress = '0xaaf6b6f4c3a20cae39a25fbcd9617822cd8bf1c7 ';

    const gqGalacticAlliance = await deploy('GQGalacticAlliance', {
        from: deployer,
        args: [],
        log: true,
        proxy: {
            proxyContract: 'OpenZeppelinTransparentProxy'
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