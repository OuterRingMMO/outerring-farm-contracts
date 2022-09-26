module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    let stakedTokenAddress = '0xF700D4c708C2be1463E355F337603183D20E0808';
    let rewardToken1Address = '0x1BB132D6039b81FaEdc524a30E52586b6Ca15f48';
    let rewardToken2Address = '0xbD1945Cd85A2BE93a6475381c9F5EDF19407A921';
    let startBlock = 21669700;
    let endBlock = 23397700;
    let lockUpDuration = 0;
    let withdrawFee = 500;
    let feeAddress = '0xaaf6b6f4c3a20cae39a25fbcd9617822cd8bf1c7 ';

    const gqGalacticAlliance = await deploy('GQGalacticAlliance', {
        from: deployer,
        args: [],
        log: true,
        proxy: {
            proxyContract: "OpenZeppelinTransparentProxy",
        },
        waitConfirmations: 5
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