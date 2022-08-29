const { BigNumber } = require("ethers");
const { parseUnits } = require("ethers/lib/utils");

module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    let stakedTokenAddress = '0xF700D4c708C2be1463E355F337603183D20E0808';
    let rewardToken1Address = '0x94b69263FCA20119Ae817b6f783Fc0F13B02ad50';
    let rewardToken2Address = '0x227a3EF4d41d0215123f3197Faa087Bf71d2236a';
    let startBlock = 19968800;
    let endBlock = 20810000;
    let lockUpDuration = 0;
    let withdrawFee = 0;
    let feeAddress = '0xaAF6B6f4c3a20cae39A25fBcD9617822cd8bf1C7';
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