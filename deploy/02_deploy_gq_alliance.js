module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    let stakedTokenAddress = '0xF700D4c708C2be1463E355F337603183D20E0808';
    let rewardToken1Address = '0xD177E36377E71775d6f9956B3fDD0f02664C6996';
    let rewardToken2Address = '0x227a3ef4d41d0215123f3197faa087bf71d2236a';
    let startBlock = 16711900;
    let endBlock = 19263900;
    let lockUpDuration = 7776000;
    let withdrawFee = 300;
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