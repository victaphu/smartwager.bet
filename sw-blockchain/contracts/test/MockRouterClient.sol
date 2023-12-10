// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Fake router client so we can test the calls being made end to end
 */
contract RouterClientMock is Ownable {

    Client.EVM2AnyMessage public latestMessage;

    constructor() Ownable(msg.sender) {}

    // Mock function to get the fee for a specific message ID
    function getFee(uint64 sourceChainSelector, Client.EVM2AnyMessage memory message) external view returns (uint256) {
        return 0.1 ether;
    }

    // Mock function to simulate sending a message
    function ccipSend(uint64 targetChainSelector, Client.EVM2AnyMessage memory message)
        external
        payable
        returns (bytes32)
    {
        latestMessage.receiver = message.receiver;
        latestMessage.data = message.data;
        latestMessage.extraArgs = message.extraArgs;
        latestMessage.feeToken = message.feeToken;
        // This is just a mock, so we don't actually do anything here
        return bytes32(0);
    }
}