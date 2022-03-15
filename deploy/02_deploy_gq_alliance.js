module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    let stakedTokenAddress = '0xe734006Fd9b3C5F1e5cF816C19e63DFAf666514C';
    let rewardToken1Address = '0x26D4e2f3943Fe603a8eCEB0A92019A2aAFF220ee';
    let rewardToken2Address = '0xAF517e25f6C80789ED841C4A79E5d7F8803Edf05';
    let startBlock = 17582958;
    let endBlock = 17982958;
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
    /*
    // Verification block
    await run("verify:verify", {
        address: gqGalacticAlliance.address,
        contract: "contracts/GQGalacticAlliance.sol:GQGalacticAlliance"
    });
    */
};

module.exports.tags = ['GQGalacticAlliance'];