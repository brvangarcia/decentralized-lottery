//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Lottery_NotEnoughtETH();
error Lottery_TransferFailed();
error Lottery_NotOpen();
error Lottery_UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 lotteryState
);

contract Lottery is VRFConsumerBaseV2, KeeperCompatibleInterface {
    enum LotteryState {
        OPEN,
        CALCULATING
    }

    uint256 private immutable _entranceFee;

    address payable[] private _players;

    VRFCoordinatorV2Interface private immutable _vrfCoordinator;

    bytes32 private immutable _gasLane;

    uint64 private immutable _subscriptionId;

    uint32 private immutable _callbackGasLimit;

    uint16 private constant REQUEST_CONFIRMATIONS = 16;

    uint32 private constant NUM_WORDS = 1;

    address private _recentWinner;

    LotteryState private _lotteryState;

    uint256 private _lastTimeStamp;

    uint256 private immutable _interval;

    event LotteryEnter(address indexed player);
    event RequestedLotteryWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        _entranceFee = entranceFee;
        _vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        _gasLane = gasLane;
        _subscriptionId = subscriptionId;
        _callbackGasLimit = callbackGasLimit;
        _lotteryState = LotteryState.OPEN;
        _lastTimeStamp = block.timestamp;
        _interval = interval;
    }

    function enterLottery() public payable {
        if (msg.value < _entranceFee) {
            revert Lottery_NotEnoughtETH();
        }
        if (_lotteryState != LotteryState.OPEN) {
            revert Lottery_NotOpen();
        }
        _players.push(payable(msg.sender));

        emit LotteryEnter(msg.sender);
    }

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool isOpen = LotteryState.OPEN == _lotteryState;
        bool timePassed = ((block.timestamp - _lastTimeStamp) > _interval);
        bool hasPlayers = _players.length > 0;
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers);
        return (upkeepNeeded, "0x0");
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");

        if (!upkeepNeeded) {
            revert Lottery_UpkeepNotNeeded(
                address(this).balance,
                _players.length,
                uint256(_lotteryState)
            );
        }
        _lotteryState = LotteryState.CALCULATING;
        uint256 requestId = _vrfCoordinator.requestRandomWords(
            _gasLane,
            _subscriptionId,
            REQUEST_CONFIRMATIONS,
            _callbackGasLimit,
            NUM_WORDS
        );

        emit RequestedLotteryWinner(requestId);
    }

    function fulfillRandomWords(
        uint256, /*requestId*/
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % _players.length;

        address payable recentWinner = _players[indexOfWinner];

        _recentWinner = recentWinner;

        _lotteryState = LotteryState.OPEN;

        _players = new address payable[](0);

        _lastTimeStamp = block.timestamp;

        (bool success, ) = recentWinner.call{value: address(this).balance}("");

        if (!success) {
            revert Lottery_TransferFailed();
        }

        emit WinnerPicked(_recentWinner);
    }

    function getLotteryState() public view returns (LotteryState) {
        return _lotteryState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getRecentWinner() public view returns (address) {
        return _recentWinner;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return _players[index];
    }

    function getLastTimeStamp() public view returns (uint256) {
        return _lastTimeStamp;
    }

    function getInterval() public view returns (uint256) {
        return _interval;
    }

    function getEntranceFee() public view returns (uint256) {
        return _entranceFee;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return _players.length;
    }
}
