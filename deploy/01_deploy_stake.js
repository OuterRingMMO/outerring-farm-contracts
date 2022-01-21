module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();


    const StakeToken = await hre.deployments.get('StakeToken');
    const stakeTokenContract = await ethers.getContractAt('StakeToken', StakeToken.address);

    const RewardToken = await hre.deployments.get('RewardToken');
    const rewardTokenContract = await ethers.getContractAt('RewardToken', RewardToken.address);
    
    let stakedToken = stakeTokenContract.address;
    let rewardToken = rewardTokenContract.address;
    let startBlock = 14537386;
    let endBlock = 23811317;
    let lockUpDuration = 7776000;
    let withdrawFee = 500;
    let feeAddress = "0x225D87f62928160CE060Bb0c119FC0Eb550d41E9";

    const stake = await deploy('Stake', {
        from: deployer,
        args: [
            stakedToken,
            rewardToken,
            startBlock,
            endBlock,
            lockUpDuration,
            withdrawFee,
            feeAddress
        ],
        log: true,
    });

    console.log('Stake deployed at: ', stake.address);

    await rewardTokenContract.transfer(stake.address, ethers.utils.parseUnits("100000.0", "ether"));

    const Stake = await hre.deployments.get('Stake');
    const stakeContract = await ethers.getContractAt('Stake', Stake.address);

    const tx = await stakeContract.poolCalcRewardPerBlock();
    console.log(tx);

    // Verification block
    await run("verify:verify", {
        address: stake.address,
        contract: "contracts/Stake.sol:Stake",
        constructorArguments: [
            stakedToken,
            rewardToken,
            startBlock,
            endBlock,
            lockUpDuration,
            withdrawFee,
            feeAddress
        ]
    });
    
};

module.exports.tags = ['Stake'];