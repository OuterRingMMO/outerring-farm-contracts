// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GQStake is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Whether a limit is set for users
    bool public hasUserLimit;

    // Whether a limit is set for users
    bool public hasDepositMin;

    // Minimum token deposit
    uint256 public minimumDeposit;

    // Whether it is initialized
    bool public isInitialized;

    // Accrued token per share
    uint256 public accTokenPerShare;

    // The block number when REWARD distribution ends.
    uint256 public endBlock;

    // The block number when REWARD distribution starts.
    uint256 public startBlock;

    // The block number of the last pool update
    uint256 public lastUpdateBlock;

    // The pool limit (0 if none)
    uint256 public poolLimitPerUser;

    // REWARD tokens created per block.
    uint256 public rewardPerBlock;

    // max amount allowed to be transferred, 0 = no limit
    uint256 public rewardMaxTxAmount = 0;

    // decimals places of the reward token
    uint8 public rewardTokenDecimals;

    // Total staked by users
    uint256 public totalStaked;

    // The precision factor
    uint256 public PRECISION_FACTOR;

    // The precision factor
    uint256 public PRECISION_FACTOR_STAKED;

    // The reward token
    IERC20 public rewardToken;

    // The staked token
    IERC20 public stakedToken;

    // Info of each user that stakes tokens (stakedToken)
    mapping(address => UserInfo) public userInfo;

    struct UserInfo {
        uint256 amount; // How many staked tokens the user has provided
        uint256 rewardDebt; // Reward debt
    }

    event AdminTokenRecovery(address tokenRecovered, uint256 amount);
    event Deposit(address indexed user, uint256 amount);
    event Claim(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);
    event NewStartAndEndBlocks(uint256 startBlock, uint256 endBlock);
    event NewRewardPerBlock(uint256 rewardPerBlock);
    event NewPoolLimit(uint256 poolLimitPerUser);
    event RewardsStop(uint256 blockNumber);
    event Withdraw(address indexed user, uint256 amount);

    /*
     * @notice Initialize the contract
     * @param _stakedToken: staked token address
     * @param _rewardToken: reward token address
     * @param _rewardPerBlock: reward per block (in rewardToken)
     * @param _startBlock: start block
     * @param _endBlock: end block
     * @param _poolLimitPerUser: pool limit per user in stakedToken (if any, else 0)
     * @param _admin: admin address with ownership
     */
    function initialize(
        IERC20 _stakedToken,
        IERC20 _rewardToken,
        uint256 _rewardPerBlock,
        uint256 _startBlock,
        uint256 _endBlock,
        uint256 _poolLimitPerUser,
        uint256 _minimumDeposit
    ) external {
        require(!isInitialized, "Already initialized");
        isInitialized = true;

        stakedToken = _stakedToken;
        rewardToken = _rewardToken;
        rewardPerBlock = _rewardPerBlock;
        startBlock = _startBlock;
        endBlock = _endBlock;

        if (_poolLimitPerUser > 0) {
            hasUserLimit = true;
            poolLimitPerUser = _poolLimitPerUser;
        }

        if (_minimumDeposit > 0) {
            hasDepositMin = true;
            minimumDeposit = _minimumDeposit;
        }

        rewardTokenDecimals = IERC20Metadata(address(rewardToken)).decimals();
        uint256 decimalsRewardToken = uint256(rewardTokenDecimals);
        require(decimalsRewardToken < 30, "Must be inferior to 30");

        PRECISION_FACTOR = uint256(10**(uint256(30).sub(decimalsRewardToken)));

        // Set the lastRewardBlock as the startBlock
        lastUpdateBlock = startBlock;
    }

    /*
     * @notice Deposit staked tokens and collect reward tokens (if any)
     * @param _amount: amount to withdraw (in rewardToken)
     */
    function deposit(uint256 _amount) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];

        if (hasUserLimit) {
            require(
                _amount.add(user.amount) <= poolLimitPerUser,
                "User amount above limit"
            );
        }

        if (hasDepositMin) {
            require(
                _amount >= minimumDeposit,
                "Deposit amount not reach the minimum"
            );
        }

        _updatePool();

        if (user.amount > 0) {
            uint256 pending = user
                .amount
                .mul(accTokenPerShare)
                .div(PRECISION_FACTOR)
                .sub(user.rewardDebt);
            if (pending > 0) {
                sendPending(pending);
            }
        }

        if (_amount > 0) {
            user.amount = user.amount.add(_amount);
            stakedToken.safeTransferFrom(
                address(msg.sender),
                address(this),
                _amount
            );
            totalStaked = totalStaked.add(_amount);
        }

        user.rewardDebt = user.amount.mul(accTokenPerShare).div(
            PRECISION_FACTOR
        );

        emit Deposit(msg.sender, _amount);
    }

    /*
     * @notice Withdraw staked tokens and collect reward tokens
     * @param _amount: amount to withdraw (in rewardToken)
     */
    function withdraw(uint256 _amount) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount >= _amount, "Amount to withdraw too high");

        _updatePool();

        uint256 pending = user
            .amount
            .mul(accTokenPerShare)
            .div(PRECISION_FACTOR)
            .sub(user.rewardDebt);

        if (_amount > 0) {
            user.amount = user.amount.sub(_amount);
            stakedToken.safeTransfer(address(msg.sender), _amount);
            totalStaked = totalStaked.sub(_amount);
        }

        if (pending > 0) {
            sendPending(pending);
        }

        user.rewardDebt = user.amount.mul(accTokenPerShare).div(
            PRECISION_FACTOR
        );

        emit Withdraw(msg.sender, _amount);
    }

    /*
     * @notice Claim reward tokens
     */
    function claim() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];

        _updatePool();

        if (user.amount > 0) {
            uint256 pending = user
                .amount
                .mul(accTokenPerShare)
                .div(PRECISION_FACTOR)
                .sub(user.rewardDebt);

            if (pending > 0) {
                sendPending(pending);
                emit Claim(msg.sender, pending);
            }
        }

        user.rewardDebt = user.amount.mul(accTokenPerShare).div(
            PRECISION_FACTOR
        );
    }

    /*
     * @notice SendPending tokens to claimer
     * @param pending: amount to claim
     */
    function sendPending(uint256 pending) internal {
        if (rewardMaxTxAmount == 0) {
            rewardToken.safeTransfer(address(msg.sender), pending);
        } else {
            while (pending > 0) {
                uint256 amount = pending > rewardMaxTxAmount
                    ? rewardMaxTxAmount
                    : pending;
                pending = pending.sub(amount);
                rewardToken.safeTransfer(address(msg.sender), amount);
            }
        }
    }

    /*
     * @notice Withdraw staked tokens without caring about rewards
     * @dev Needs to be for emergency.
     */
    function emergencyWithdraw() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        uint256 amountToTransfer = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;

        if (amountToTransfer > 0) {
            stakedToken.safeTransfer(address(msg.sender), amountToTransfer);
            totalStaked = totalStaked.sub(amountToTransfer);
        }

        emit EmergencyWithdraw(msg.sender, user.amount);
    }

    /**
     * @notice It allows the admin to recover wrong tokens sent to the contract
     * @param _tokenAddress: the address of the token to withdraw
     * @param _tokenAmount: the number of tokens to withdraw
     * @dev This function is only callable by admin.
     */
    function recoverWrongTokens(address _tokenAddress, uint256 _tokenAmount)
        external
        onlyOwner
    {
        require(
            _tokenAddress != address(stakedToken),
            "Cannot be staked token"
        );
        require(
            _tokenAddress != address(rewardToken),
            "Cannot be reward token"
        );

        IERC20(_tokenAddress).safeTransfer(address(msg.sender), _tokenAmount);

        emit AdminTokenRecovery(_tokenAddress, _tokenAmount);
    }

    /*
     * @notice Stop rewards
     * @dev Only callable by owner
     */
    function stopReward() external onlyOwner {
        endBlock = block.number;
    }

    /*
     * @notice Update pool limit per user
     * @dev Only callable by owner.
     * @param _hasUserLimit: whether the limit remains forced
     * @param _poolLimitPerUser: new pool limit per user
     */
    function updatePoolLimitPerUser(
        bool _hasUserLimit,
        uint256 _poolLimitPerUser
    ) external onlyOwner {
        require(hasUserLimit, "Must be set");
        if (_hasUserLimit) {
            require(
                _poolLimitPerUser > poolLimitPerUser,
                "New limit must be higher"
            );
            poolLimitPerUser = _poolLimitPerUser;
        } else {
            hasUserLimit = _hasUserLimit;
            poolLimitPerUser = 0;
        }
        emit NewPoolLimit(poolLimitPerUser);
    }

    /*
     * @notice Update reward per block
     * @dev Only callable by owner.
     * @param _rewardPerBlock: the reward per block
     */
    function updateRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        require(block.number < startBlock, "Pool has started");
        rewardPerBlock = _rewardPerBlock;
        emit NewRewardPerBlock(_rewardPerBlock);
    }

    /**
     * @notice It allows the admin to update start and end blocks
     * @dev This function is only callable by owner.
     * @param _startBlock: the new start block
     * @param _bonusEndBlock: the new end block
     */
    function updateStartAndEndBlocks(
        uint256 _startBlock,
        uint256 _bonusEndBlock
    ) external onlyOwner {
        require(block.number < startBlock, "Pool has started");
        require(
            _startBlock < _bonusEndBlock,
            "New startBlock must be lower than new endBlock"
        );
        require(
            block.number < _startBlock,
            "New startBlock must be higher than current block"
        );

        startBlock = _startBlock;
        endBlock = _bonusEndBlock;

        // Set the lastRewardBlock as the startBlock
        lastUpdateBlock = startBlock;

        emit NewStartAndEndBlocks(_startBlock, _bonusEndBlock);
    }

    /*
     * @notice View function to see pending reward on frontend.
     * @param _user: user address
     * @return Pending reward for a given user
     */
    function pendingReward(address _user) external view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 stakedTokenSupply = totalStaked;
        if (block.number > lastUpdateBlock && stakedTokenSupply != 0) {
            uint256 multiplier = _getMultiplier(lastUpdateBlock, block.number);
            uint256 tokenReward = multiplier.mul(rewardPerBlock);
            uint256 adjustedTokenPerShare = accTokenPerShare.add(
                tokenReward.mul(PRECISION_FACTOR).div(stakedTokenSupply)
            );
            return
                user
                    .amount
                    .mul(adjustedTokenPerShare)
                    .div(PRECISION_FACTOR)
                    .sub(user.rewardDebt);
        } else {
            return
                user.amount.mul(accTokenPerShare).div(PRECISION_FACTOR).sub(
                    user.rewardDebt
                );
        }
    }

    /*
     * @notice Update reward variables of the given pool to be up-to-date.
     */
    function _updatePool() internal {
        if (block.number <= lastUpdateBlock) {
            return;
        }

        uint256 stakedTokenSupply = totalStaked;
        if (stakedTokenSupply == 0) {
            lastUpdateBlock = block.number;
            return;
        }

        uint256 multiplier = _getMultiplier(lastUpdateBlock, block.number);
        uint256 tokenReward = multiplier.mul(rewardPerBlock);
        accTokenPerShare = accTokenPerShare.add(
            tokenReward.mul(PRECISION_FACTOR).div(stakedTokenSupply)
        );
        lastUpdateBlock = block.number;
    }

    /*
     * @notice Return reward multiplier over the given _from to _to block.
     * @param _from: block to start
     * @param _to: block to finish
     * @return multiplier
     */
    function _getMultiplier(uint256 _from, uint256 _to)
        internal
        view
        returns (uint256)
    {
        if (_to <= endBlock) {
            return _to.sub(_from);
        } else if (_from >= endBlock) {
            return 0;
        } else {
            return endBlock.sub(_from);
        }
    }

    /*
     * @notice Sets the minimum amount to deposit
     * @param _minimumDeposit: Minimum amount to deposit
     * @dev This function is only callable by owner.
     */
    function setMinimumDeposit(uint256 _minimumDeposit) public onlyOwner {
        minimumDeposit = _minimumDeposit;
    }

    /*
     * @notice Sets start block of the pool given a block amount
     * @param _blocks: block amount
     * @dev This function is only callable by owner.
     */
    function poolStartIn(uint256 _blocks) public onlyOwner {
        poolSetStart(block.number.add(_blocks));
    }

    /*
     * @notice Sets start block of the pool
     * @param _startBlock: start block
     * @dev This function is only callable by owner.
     */
    function poolSetStart(uint256 _startBlock) public onlyOwner {
        require(block.number < startBlock, "Pool has started");
        uint256 rewardDurationValue = rewardDuration();
        startBlock = _startBlock;
        endBlock = startBlock.add(rewardDurationValue);
        lastUpdateBlock = startBlock;
    }

    /*
     * @notice Set the duration of the pool
     * @param _durationBlocks: duration block amount
     * @dev This function is only callable by owner.
     */
    function poolSetDuration(uint256 _durationBlocks) public onlyOwner {
        require(block.number < startBlock, "Pool has started");
        endBlock = startBlock.add(_durationBlocks);
        poolCalcRewardPerBlock();
    }

    /*
     * @notice Set the duration and start block of the pool
     * @param _startBlock: start block
     * @param _durationBlocks: duration block amount
     * @dev This function is only callable by owner.
     */
    function poolSetStartAndDuration(
        uint256 _startBlock,
        uint256 _durationBlocks
    ) public onlyOwner {
        poolSetStart(_startBlock);
        poolSetDuration(_durationBlocks);
    }

    /*
     * @notice Calculates the rewardPerBlock of the pool
     * @dev This function is only callable by owner.
     */
    function poolCalcRewardPerBlock() public onlyOwner {
        uint256 rewardBal = rewardToken.balanceOf(address(this)).sub(
            totalStaked
        );
        rewardPerBlock = rewardBal.div(rewardDuration());
    }

    /*
     * @notice Sets the max reward amount for a TX
     * @param _maxTxAmount: max TX amount
     * @dev This function is only callable by owner.
     */
    function poolSetRewardMaxTxAmount(uint256 _maxTxAmount) public onlyOwner {
        rewardMaxTxAmount = _maxTxAmount;
    }

    /*
     * @notice Gets the reward duration
     * @return reward duration
     */
    function rewardDuration() public view returns (uint256) {
        return endBlock.sub(startBlock);
    }

    /*
     * @notice Gets the reward per block for UI
     * @return reward per block
     */
    function rewardPerBlockUI() public view returns (uint256) {
        return rewardPerBlock.div(10**uint256(rewardTokenDecimals));
    }

    /*
     * @notice Withdraws the remaining funds
     * @param _to The address where the funds will be sent
     */
    function withdrawRemains(address _to) public onlyOwner {
        require(block.number > endBlock, "Error: Pool not finished yet");
        require(totalStaked == 0, "Error: Someone has staked tokens");
        uint256 tokenBal = rewardToken.balanceOf(address(this));
        require(tokenBal > 0, "Error: No remaining funds");
        IERC20(rewardToken).safeTransfer(_to, tokenBal);
    }

    /*
     * @notice Deposit funds for reward
     * @param _to The address where the funds will be sent
     */
    function depositRewardFunds(uint256 _amount) public onlyOwner {
        IERC20(rewardToken).safeTransfer(address(this), _amount);
    }
}
