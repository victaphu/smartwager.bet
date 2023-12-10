// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import necessary interfaces and libraries
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../tokens/ClaimNote721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StakeWiseWhitelistNFT.sol";

/**
 * @title ChainlinkTokenEscrowService
 * @notice An escrow service to bridge tokens between chains using Chainlink oracles.
 * It enables the movement of tokens across different blockchains and the creation
 * of claim notes as ERC721 tokens on the destination chain. Users must fund the contract
 * with sufficient ETH before they transfer an ERC721 token into the contract or it will
 * be rejected. Fee estimates can be obtained using the get fees functions
 *
 * @author Victa
 */
contract ChainlinkTokenEscrowService is CCIPReceiver, IERC721Receiver, Ownable {
    
    // Enum to specify the fee payment method
    enum PayFeesIn {
        Native,
        LINK
    }

    // Structure to define the token message format
    struct TokenMessage {
        address token; // Token address
        uint256 tokenId; // Token ID
        address from; // Recipient's address
        bool claim; // Indicates if it's a claim or a minting of a claim note
    }

    // Structure to define the Chainlink Token Escrow Service (CTES) message format
    struct CTESMessage {
        uint64 sourceChainSelector;
        PayFeesIn payFeesIn;
    }

    // Immutable addresses for LINK token and the claim note contract
    address immutable i_link;
    address immutable claim_note;
    address immutable whitelistNft;

    event MessageSent(bytes32 messageId);

    // Mapping to track deposited Ether by user
    mapping(address => uint256) public depositedEth;

    /**
     * @notice Constructor to initialize the ChainlinkTokenEscrowService contract
     * @param router The address of the Chainlink CCIP router
     * @param link The address of the LINK token
     * @param claimNote The address of the claim note contract
     * @param whitelist The address of the whitelist NFT contract
     */
    constructor(
        address router,
        address link,
        address claimNote,
        address whitelist
    ) CCIPReceiver(router) Ownable(msg.sender) {
        i_link = link;
        claim_note = claimNote;
        // Approve the router contract to spend LINK tokens
        // LinkTokenInterface(i_link).approve(i_router, type(uint256).max);
        whitelistNft = whitelist;
    }

    /**
     * @notice Receive function to accept Ether deposits from users
     */
    receive() external payable {
        depositedEth[msg.sender] = depositedEth[msg.sender] + msg.value;
    }

    /**
     * @notice Internal function to process CCIP messages
     * @param any2EvmMessage The CCIP message received
     */
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        uint64 selector = any2EvmMessage.sourceChainSelector;
        TokenMessage memory message = abi.decode(
            any2EvmMessage.data,
            (TokenMessage)
        );
        if (message.claim) {
            // Transfer token to the recipient
            IERC721(message.token).safeTransferFrom(
                address(this),
                message.from,
                message.tokenId
            );
        } else {
            // Mint a claim note
            ClaimNote721(claim_note).mint(
                message.from,
                selector,
                message.token,
                message.tokenId
            );
        }
    }

    /**
     * @notice Public function to get a Chainlink message object
     * @param operator The address of the operator
     * @param from The address of the sender
     * @param tokenId The ID of the token
     * @param ctesMessage The CTES message
     * @param isClaim A boolean indicating if the operation is a claim
     * @return A Chainlink EVM2AnyMessage object
     */
    function getChainlinkMessage(
        address operator,
        address from,
        uint256 tokenId,
        CTESMessage memory ctesMessage,
        bool isClaim
    ) public view returns (Client.EVM2AnyMessage memory) {
        // encoded message is a redemption if the nft is a claim note
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(from),
            data: abi.encode(
                TokenMessage(operator, tokenId, from, isClaim)
            ),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: ctesMessage.payFeesIn == PayFeesIn.LINK
                ? i_link
                : address(0)
        });

        return message;
    }

    /**
     * @notice Public function to get an estimated fee for a transaction on CCIP
     * @param operator The address of the operator
     * @param from The address of the sender
     * @param tokenId The ID of the token
     * @param data The additional data provided
     * @return fee The estimated fee for the transaction
     */
    function getFeeEstimate(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) public view returns (uint256) {
        CTESMessage memory ctesMessage = abi.decode(data, (CTESMessage));

        Client.EVM2AnyMessage memory message = getChainlinkMessage(
            operator,
            from,
            tokenId,
            ctesMessage,
            false
        );

        uint256 fee = IRouterClient(i_router).getFee(
            ctesMessage.sourceChainSelector,
            message
        );

        return fee;
    }

    /**
     * @notice retrieve estimate for sending a redemption request for a claim note between chains
     * @param from the redeemer of the claim note
     * @param tokenId the token to redeem
     * @return fees the amount of eth to pay
     */
    function getFeeEstimateForClaim(
        address from,
        uint256 tokenId
    ) public view returns (uint256) {
        (Client.EVM2AnyMessage memory message, uint64 chain) = redeemClaimNote(from, tokenId);

        uint256 fee = IRouterClient(i_router).getFee(
            chain,
            message
        );

        return fee;
    }

    /**
     * @notice Public function to encode a CTESMessage
     * @param sourceChainSelector The selector for the source chain
     * @param fees The fee payment method
     * @return A byte array representing the encoded CTESMessage
     */
    function getEncoded(
        uint64 sourceChainSelector,
        PayFeesIn fees
    ) public pure returns (bytes memory) {
        return abi.encode(CTESMessage(sourceChainSelector, fees));
    }

    /**
     * @notice an internal function that's called when a user is redeeming a claim note
     * The claim note request is transferred across chain as an EVM2AnyMessage
     * @param from the address of the sender of the token
     * @param tokenId the token id being sent
     * @return message the EVM2AnyMessage encoded with the requested token bridge
     * @return chain the chain that we will be bridging to
     */
    function redeemClaimNote(
        address from,
        uint256 tokenId
    ) internal view returns (Client.EVM2AnyMessage memory message, uint64 chain) {
        ClaimNote721.ClaimNote memory note = ClaimNote721(claim_note).findNote(tokenId);

        require(note.sourceChain > 0, "token not found");

        chain = note.sourceChain;
        CTESMessage memory ctesMessage = CTESMessage(chain, PayFeesIn.Native);

        message = getChainlinkMessage(note.sourceTokenAddress, from, note.sourceTokenId, ctesMessage, true);
    }

    /**
     * @notice internal function to help create the EVM2AnyMessage used by CCIP to send messages between chains
     * @param operator the address of the operator sending the token
     * @param from the address of the sender of the token
     * @param tokenId the token id being sent
     * @param data additional data encoded as a CTESMessage
     * @return message the EVM2AnyMessage encoded with the requested token bridge
     * @return chain the chain that we will be bridging to
     */
    function bridgeToken(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) internal returns (Client.EVM2AnyMessage memory message, uint64 chain) {
        require(
            data.length > 0,
            "Invalid data - escrow needs CTESMessage as data"
        );
        CTESMessage memory ctesMessage = abi.decode(data, (CTESMessage));
        message = getChainlinkMessage(operator, from, tokenId, ctesMessage, false);
        chain = ctesMessage.sourceChainSelector;
    }

    /**
     * @notice ERC721 token receiver function to accept tokens along with CCIP messages as data
     * @param - The address of the operator sending the token
     * @param from The address of the sender of the token
     * @param tokenId The ID of the token being sent
     * @param data Additional data accompanying the token transfer
     * @return A bytes4 value confirming the receipt of the token
     */
    function onERC721Received(
        address,
        address from,
        uint256 tokenId,
        bytes memory data
    ) external override returns (bytes4) {
        require(StakeWiseWhitelistNFT(whitelistNft).isWhitelisted(msg.sender), 'failed, not part of whitelist');

        // check if i am now owner of the nft

        Client.EVM2AnyMessage memory message;
        uint64 chain;
        if (msg.sender == claim_note) {
            (message, chain) = redeemClaimNote(from, tokenId);
            ClaimNote721(claim_note).claim(from, tokenId);
        } else {
            (message, chain) = bridgeToken(msg.sender, from, tokenId, data);
        }

        uint256 fee = IRouterClient(i_router).getFee(chain, message);

        require(depositedEth[from] >= fee, "Insufficient deposit");

        // Payment in native currency only for this phase
        bytes32 messageId = IRouterClient(i_router).ccipSend{value: fee}(
            chain,
            message
        );
        emit MessageSent(messageId);
        depositedEth[from] = depositedEth[from] - fee;

        return IERC721Receiver.onERC721Received.selector;
    }
}
