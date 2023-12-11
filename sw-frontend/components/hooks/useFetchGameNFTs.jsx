import { waitForTransaction, prepareWriteContract, writeContract } from "@wagmi/core";
import common from "../common/common";
import { useState } from "react";
import { polygonMumbai } from "viem/chains";
import { createPublicClient, http } from "viem";

const swnftAbi = [{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "result",
      "type": "uint256"
    }
  ],
  "name": "getResult",
  "outputs": [
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "player1",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "player2",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "p1Position",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "p2Position",
          "type": "uint256"
        },
        {
          "internalType": "enum SWNFT.GameState",
          "name": "started",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "p1TokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "p2TokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "p1TokenAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "p2TokenAddress",
          "type": "address"
        }
      ],
      "internalType": "struct SWNFT.Game",
      "name": "game",
      "type": "tuple"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "counter",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}];

export default function useFetchGameNFTs() {
  const [isLoading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  async function fetchGames() {
    setLoading(true);

    try {
      const client = createPublicClient({
        chain: polygonMumbai,
        transport: http()
      });

      const totalNFTs = await client.readContract({
        address: common.swnft,
        abi: swnftAbi,
        functionName: "counter"
      });
      console.log(totalNFTs);
      const games = [];
      for (let i = 0; i < totalNFTs; ++i) {
        const game = await client.readContract({
          address: common.swnft,
          abi: swnftAbi,
          functionName: "getResult",
          args: [i + 1]
        });
        game.id = i + 1;
        console.log(game);
        games.push(game);
      }
      setGames(games);
    }
    finally {
      setLoading(false);
    }
  }
  return { fetchGames, games, isLoading };
}