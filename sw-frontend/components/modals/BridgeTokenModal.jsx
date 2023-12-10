import Image from "next/image";
import { useEffect, useState } from "react";
import Select from "../select/Select";
import { erc721ABI, sepolia, useAccount, useContractRead, useContractWrite, usePrepareContractWrite, usePrepareSendTransaction } from "wagmi";
import common, { chainlinkTokenEscrowServiceABI } from "../common/common";
import { createPublicClient, http, parseEther } from "viem";
import { polygonMumbai } from "viem/chains";
import { ethers } from "ethers";
import { waitForTransaction, prepareSendTransaction, sendTransaction, prepareWriteContract, writeContract } from "@wagmi/core";

const BridgeTokenModal = ({ chainSelector, escrowAddress, nftAddress, sourceChainId }) => {
  console.log(chainSelector, escrowAddress, nftAddress, sourceChainId)
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState(1);
  const [nfts, setNFTs] = useState([]);
  const [sending, isSending] = useState(false);

  const { config, error } = usePrepareContractWrite({
    address: common.sampleNft,
    abi: [{
      "inputs": [],
      "name": "mintToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }],
    chainId: 80001,
    functionName: 'mintToken'
  });

  const { writeAsync, isLoading } = useContractWrite(config);

  const getListNFTs = async () => {
    const client = createPublicClient({
      chain: sepolia,
      transport: http()
    });

    const nfts = [];

    const total = 100;

    for (let i = 0; i < Number(total); ++i) {
      try {
        const owner = await client.readContract({
          address: nftAddress,
          abi: erc721ABI,
          functionName: "ownerOf",
          args: [i + 1]
        });

        if (owner === ethers.ZeroAddress) {
          console.log('breaking after ', i);
          break;
        }

        if (owner === address) {
          nfts.push({ id: i, name: 'NFT ' + i });
        }
      }
      catch (e) {
        break;
      }
    }

    setNFTs(nfts);
    console.log(nfts);
    if (nfts.length > 0) {
      setTokenId(nfts[0].id);
    }

    return nfts;
  }

  const startCCIP = async () => {
    isSending(true)
    console.log(tokenId);
    try {
      const client = createPublicClient({
        chain: sepolia.id === sourceChainId ? sepolia : polygonMumbai,
        transport: http()
      });

      const encoded = await client.readContract({
        address: escrowAddress,
        abi: chainlinkTokenEscrowServiceABI,
        functionName: 'getEncoded',
        args: [chainSelector, 0] // pay in eth
      });
      console.log('encoded is', encoded);
      const feeEstimate = await client.readContract({
        address: escrowAddress,
        abi: chainlinkTokenEscrowServiceABI,
        functionName: 'getFeeEstimate',
        args: [nftAddress, address, tokenId, encoded]
      });

      console.log('fee estimate is', feeEstimate);
      const request = await prepareSendTransaction({
        to: escrowAddress,
        value: feeEstimate
      });
      console.log('transfer completed');
      const receipt = await sendTransaction(request);
      await waitForTransaction(receipt);

      console.log('lets send the nft!');
      const request2 = await prepareWriteContract({
        address: nftAddress,
        abi: erc721ABI,
        functionName: 'safeTransferFrom',
        args: [address, escrowAddress, tokenId, encoded]
      });

      const hash2 = await writeContract(request2.request);
      await waitForTransaction(hash2);
    }
    catch (e) {
      console.log(e);
    }
    isSending(false);
  }

  useEffect(() => {
    getListNFTs();
  }, []);

  return (
    <div className="betpopmodal">
      <div
        className="modal fade"
        id="bridgenft"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xxl-8 col-xl-9 col-lg-11">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="top-item">
                      <h4>Bridge Token between Escrow Services</h4>
                    </div>
                    <div className="select-odds align-items-center">
                      {nfts.length > 0 && <h6>Select NFT to Bridge</h6>}
                      {nfts.length > 0 && <Select data={nfts} onChange={(e) => setTokenId(e.id)} />}
                      {nfts.length == 0 && <div>
                        <p>You don't have any NFTs, why not claim a free NFT and try us out?</p>
                        <button disabled={isLoading} onClick={async (e) => {
                          const res = await writeAsync?.();
                          await waitForTransaction(res);
                          getListNFTs();
                        }} className="mdr cmn-btn">{isLoading ? "Redeeming Free NFT" : "Claim a free NFT!"}</button>
                      </div>}
                    </div>
                    <div className="mid-area">
                      <div className="single-item">
                        <h6>Notice :</h6>
                        <p>
                          You will pay two transactions to move the NFT, the first transaction will pay for the toll, and
                          the second transaction will transfer the selected NFT into the Chainlink Token Escrow Service.
                        </p>
                      </div>
                    </div>
                    <div className="bottom-area">
                      {sending && <div><div className="spinner-border text-primary" role="status">
                        <span className="sr-only "></span>
                      </div>
                      </div>}

                      {!sending && <button disabled={nfts.length == 0} onClick={startCCIP} className="mdr cmn-btn">Bridge NFT</button>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgeTokenModal;
