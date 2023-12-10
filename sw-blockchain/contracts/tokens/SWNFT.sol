// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../iface/ISWNFT.sol";
import "../service/StakeWiseWhitelistNFT.sol";

/**
 * @title SWNFT
 * @notice A dynamic NFT contract for a two-player game. It handles game creation, acceptance,
 * decline, cancellation, and claiming of winnings. Each game involves staking NFTs.
 *
 * @author Victa
 */
contract SWNFT is ERC721URIStorage, Ownable, IERC721Receiver, ISWNFT {
    enum GameState {
        PENDING,
        STARTED,
        CANCELLED,
        COMPLETED
    }
    // Structure to define a game
    struct Game {
        uint256 gameId;
        address player1;
        address player2;
        uint256 p1Position;
        uint256 p2Position;
        GameState started;
        uint256 p1TokenId;
        uint256 p2TokenId;
        address p1TokenAddress;
        address p2TokenAddress;
    }


    // Mapping from token ID to game result
    mapping(uint256 => Game) public results;

    // Mapping for stake wise results
    mapping(uint256 => uint256) public stakeWiseResults;
    uint256 public counter = 0;

    address immutable whitelistNft;

    /**
     * @notice Constructor for SWNFT
     * @param whitelist Address of the whitelist NFT contract
     */
    constructor(
        address whitelist
    ) Ownable(msg.sender) ERC721("StakeWise Game", "SWG") {
        whitelistNft = whitelist;
    }

    /**
     * @notice Updates the result of a game. The StakeWise Wager Service will update this.
     * as each 'game' has a reference to the shared gameid, this means multiple NFTs can have
     * the same game id (e.g. Australia vs Pakistan wagers). Results are pulled by the gamers
     *
     * @param gameId The ID of the shared game 
     * @param result The result of the shared game
     */
    function updateResult(uint256 gameId, uint256 result) external onlyOwner() {  
        require(result > 0, 'invalid result, must be greater than 0');
        require(stakeWiseResults[gameId] == 0, 'result already captured');
        stakeWiseResults[gameId] = result;
    }

    /**
     * @notice Mints a new game NFT. only the owner can create this (stakewise wagers service) 
     * as we also control the gameid (shared).
     *
     * @param player The address of the player
     * @param gameId The ID of the game. this is a shared id for a game outcome which is updated externally
     */
    function mint(address player, uint256 gameId) external override onlyOwner() {
        counter++;
        results[counter] = Game(
            gameId,
            player,
            address(0),
            0,
            0,
            // 0,
            GameState.PENDING,
            0,
            0,
            address(0),
            address(0)
        );
        _safeMint(player, counter);
    }

    // Modifier to ensure the caller is the owner of the token
    modifier tokenOwner(uint256 tokenId) {
        require(results[tokenId].player1 == msg.sender, "not owner of wager");
        _;
    }

    // Modifier to ensure the game has started
    modifier gameStarted(uint256 tokenId) {
        require(
            results[tokenId].started == GameState.STARTED,
            "game not started"
        );
        _;
    }

    function getResult(uint256 result) external view returns(Game memory game) {
        game = results[result];
    }

    /**
     * @notice Accepts the game challenge and starts the game. the player who minted the nft must make sure
     * they are happy with what player2 is offering before the game can commence
     * @param tokenId The ID of the game token
     */
     function accept(uint256 tokenId) external tokenOwner(tokenId) {
        require(
            results[tokenId].started == GameState.PENDING,
            "already started"
        );
        
        require(
            results[tokenId].p1TokenAddress != address(0),
            "waiting for p1 to send token"
        );
        require(
            results[tokenId].p2TokenAddress != address(0),
            "waiting for p2 to send token"
        );
        require(results[tokenId].player2 != address(0), "not yet accepted");
        require(
            results[tokenId].p1TokenAddress != address(0),
            "waiting for p1 to send token"
        );
        require(
            results[tokenId].p1TokenAddress != address(0),
            "waiting for p2 to send token"
        );
        require(stakeWiseResults[results[tokenId].gameId] == 0, "game already completed");
        results[tokenId].started = GameState.STARTED;
        // run the game!
    }

    /**
     * @notice Declines the game challenge and returns the NFT to the challenger
     * @param tokenId The ID of the game token
     */
     function decline(uint256 tokenId) external tokenOwner(tokenId) {
        Game memory game = results[tokenId];
        require(stakeWiseResults[results[tokenId].gameId] == 0, "cannot decline game completed");
        require(
            game.started != GameState.PENDING,
            "cannot decline game started"
        );
        require(game.player2 != address(0), "p2 not ready");

        IERC721(game.p2TokenAddress).safeTransferFrom(
            address(this),
            game.player2,
            game.p2TokenId
        );
    }

    /**
     * @notice Cancels the game and returns the NFTs to both players
     * @param tokenId The ID of the game token
     */
     function cancel(uint256 tokenId) external tokenOwner(tokenId) {
        Game memory game = results[tokenId];
        require(stakeWiseResults[results[tokenId].gameId] == 0, "cannot cancel game completed");
        require(
            results[tokenId].started == GameState.PENDING,
            "cannot cancel game started"
        );

        // return NFT to each player!
        if (game.p1TokenAddress != address(0)) {
            IERC721(game.p1TokenAddress).safeTransferFrom(
                address(this),
                game.player1,
                game.p1TokenId
            );
        }
        if (game.p2TokenAddress != address(0)) {
            IERC721(game.p2TokenAddress).safeTransferFrom(
                address(this),
                game.player2,
                game.p2TokenId
            );
        }

        results[tokenId].started = GameState.CANCELLED; 
    }

    /**
     * @notice Allows the winner to claim their winnings
     * @param tokenId The ID of the game token
     */
    function claim(
        uint256 tokenId
    ) external {
        Game memory game = results[tokenId];
        require(game.player1 == msg.sender || game.player2 == msg.sender, 'not players');
        // require(game.started != GameState.CLAIMED, 'already claimed');
        // require(game.started == GameState.COMPLETED, 'game not completed');
        require(stakeWiseResults[game.gameId] > 0, "game not completed");
        require(
            (game.player1 == msg.sender && stakeWiseResults[game.gameId] == game.p1Position) ||
                (game.player2 == msg.sender && stakeWiseResults[game.gameId] == game.p2Position),
            "not winner"
        );

        results[tokenId].started = GameState.COMPLETED;

        IERC721(game.p1TokenAddress).safeTransferFrom(
            address(this),
            msg.sender,
            game.p1TokenId
        );
        IERC721(game.p2TokenAddress).safeTransferFrom(
            address(this),
            msg.sender,
            game.p2TokenId
        );
    }

    /**
     * @notice ERC721 token receiver function handling incoming NFTs for games
     * @param - The address which called the `safeTransferFrom` function
     * @param from The address which previously owned the token
     * @param tokenId The ID of the token being transferred
     * @param data Additional data with no specified format
     * @return bytes4 indicating the function's success
     */
    function onERC721Received(
        address,
        address from,
        uint256 tokenId,
        bytes memory data
    ) external override returns (bytes4) {
        require(
            StakeWiseWhitelistNFT(whitelistNft).isWhitelisted(msg.sender),
            "invalid whitelist"
        );
        (uint256 gameId, uint256 choice) = abi.decode(data, (uint256, uint256));
        Game memory game = results[gameId];

        require(game.gameId > 0, "invalid game");
        require(choice > 0, 'cannot choose choice 0');
        require(game.started == GameState.PENDING, "game already started");

        if (game.player1 == from) {
            require(game.p1TokenAddress == address(0), "p1 already defined");
            results[gameId].p1TokenAddress = msg.sender;
            results[gameId].p1TokenId = tokenId;
            require (game.p2Position != choice, 'cannot be same as p2');
            results[gameId].p1Position = choice;
        } else {
            require(game.player2 == address(0), "player2 defined already");
            results[gameId].player2 = from;
            results[gameId].p2TokenAddress = msg.sender;
            results[gameId].p2TokenId = tokenId;
            require (game.p1Position != choice, 'cannot be same as p1');
            results[gameId].p2Position = choice;
        }

        return IERC721Receiver.onERC721Received.selector;
    }

    /**
     * @notice Internal function to update NFT ownership, restricting transfers until game completion
     * @param to The address receiving the NFT
     * @param tokenId The ID of the NFT
     * @param auth The address authorized to make the transfer
     * @return The address that is now the owner of the NFT
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);

        if (to != address(0) && from != address(0)) {
            // transfer event
            // transfer enabled if game is complete
            require(results[tokenId].started == GameState.COMPLETED, 'cannot transfer until game is completed');
        }

        // reject if the token 
        return super._update(to, tokenId, auth);
    }
}
