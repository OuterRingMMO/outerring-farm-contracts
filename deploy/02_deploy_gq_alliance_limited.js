const { BigNumber } = require("ethers");
const { parseUnits } = require("ethers/lib/utils");

module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    let stakedTokenAddress = '0xAC1F5e57d53e9Ac3c092EB876e46C235df95672A';
    let rewardToken1Address = '0x227a3EF4d41d0215123f3197Faa087Bf71d2236a';
    let rewardToken2Address = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';
    let startBlock = 18275534;
    let endBlock = 20896334;
    let lockUpDuration = 2592000;
    let withdrawFee = 500;
    let feeAddress = '0xaaf6b6f4c3a20cae39a25fbcd9617822cd8bf1c7';
    let maxStakeAmount = parseUnits("49000", "ether");

    const gqGalacticAlliance = await deploy('GQGalacticAllianceLimited', {
        from: deployer,
        args: [],
        log: true,
        proxy: {
            proxyContract: 'OpenZeppelinTransparentProxy'
        }
    });
    console.log('GQGalacticAlliance deployed at: ', gqGalacticAlliance.address);
    const GQGalacticAllianceImplementation = await hre.deployments.get('GQGalacticAllianceLimited_Implementation');
    const GQGalacticAllianceDeployed = await ethers.getContractAt('GQGalacticAllianceLimited', GQGalacticAllianceImplementation.address);
    // Verification block
    await run("verify:verify", {
        address: GQGalacticAllianceDeployed.address,
        contract: "contracts/GQGalacticAllianceLimited.sol:GQGalacticAllianceLimited"
    });

};

module.exports.tags = ['GQGalacticAllianceLimited'];