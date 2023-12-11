import { waitForTransaction, prepareWriteContract, writeContract } from "@wagmi/core";
import common from "../common/common";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { useState } from "react";

export default function useMintSample() {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const [isLoading, setLoading] = useState(false);
  async function checkNetworkAndMint() {
    setLoading(true);
    try {
      if (chain.id != common.chain.sepolia) {
        const result = await switchNetworkAsync(common.chain.sepolia);
        if (result.id != common.chain.sepolia) {
          return false;
        }
      }
      const request = await prepareWriteContract({
        address: common.sampleNft,
        abi: [{
          "inputs": [],
          "name": "mintToken",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }],
        chainId: common.chain.sepolia,
        functionName: "mintToken"
      });

      const hash = await writeContract(request.request);
      console.log(hash);
      const res = await waitForTransaction(hash);
      console.log(res);

      return true;
    }
    catch (e) {
      console.log('failed to mint', e);
    }
    finally {
      setLoading(false);
    }
  }

  return { checkNetworkAndMint, isLoading };
}