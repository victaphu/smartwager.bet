import Image from "next/image";
import { useEffect, useState } from "react";
import Select from "../select/Select";
import { erc721ABI, sepolia, useAccount, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, usePrepareSendTransaction, useSwitchNetwork } from "wagmi";
import common, { chainlinkTokenEscrowServiceABI } from "../common/common";
import { createPublicClient, http, parseEther } from "viem";
import { polygonMumbai } from "viem/chains";
import { ethers } from "ethers";
import { waitForTransaction, prepareSendTransaction, sendTransaction, prepareWriteContract, writeContract } from "@wagmi/core";
import useMintSample from "../hooks/useMintSampleNFT";

const BridgeTokenModal = () => {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState(1);
  const [nfts, setNFTs] = useState([]);
  const [sending, isSending] = useState(false);

  const [chainSelector, setChainSelector] = useState('');
  const [escrowAddress, setEscrowAddress] = useState('');
  const [nftAddress, setNftAddress] = useState('');
  const [sourceChainId, setSourceChainId] = useState('');
  const [explorerLink, setExplorerLink] = useState('');
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const [refreshing, setRefreshing] = useState(false);

  const { checkNetworkAndMint, isLoading } = useMintSample();

  const getListNFTs = async () => {
    setRefreshing(true);
    try {
      const client = createPublicClient({
        chain: sepolia.id === +sourceChainId ? sepolia : polygonMumbai,
        transport: http()
      });

      const nfts = [];

      const total = 100;

      const balance = await client.readContract({
        address: nftAddress,
        abi: erc721ABI,
        functionName: "balanceOf",
        args: [address || common.sampleNft]
      });

      const offset = nftAddress === common.claimNote || nftAddress === common.sepolia.claimNote ? 0 : 1;

      for (let i = 0; i < Number(total) && balance > 0; ++i) {
        try {
          const owner = await client.readContract({
            address: nftAddress,
            abi: erc721ABI,
            functionName: "ownerOf",
            args: [i + offset]
          });

          if (owner === ethers.ZeroAddress) {
            console.log("NFT rejected")
            break;
          }

          if (owner === address) {
            nfts.push({ id: i + offset, name: "NFT " + i });
          }

          if (balance === nfts.length) {
            break; // break if we found all the nfts
          }
        }
        catch (e) {
          console.log(e);
          if (balance > nfts.length) {
            continue;
          }
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
    finally {
      setRefreshing(false);
    }
  }

  const startCCIP = async () => {
    isSending(true)
    console.log(tokenId);
    try {

      if (chain.id != sourceChainId) {
        await switchNetworkAsync(sourceChainId)
        console.log('network switched');
      }

      const client = createPublicClient({
        chain: sepolia.id === +sourceChainId ? sepolia : polygonMumbai,
        transport: http()
      });

      const encoded = await client.readContract({
        address: escrowAddress,
        abi: chainlinkTokenEscrowServiceABI,
        functionName: "getEncoded",
        args: [chainSelector, 0] // pay in eth
      });
      console.log("encoded is", encoded);
      const feeEstimate = await client.readContract({
        address: escrowAddress,
        abi: chainlinkTokenEscrowServiceABI,
        functionName: "getFeeEstimate",
        args: [nftAddress, address, tokenId, encoded]
      });

      console.log("fee estimate is", feeEstimate);

      const deposited = await client.readContract({
        address: escrowAddress,
        abi: chainlinkTokenEscrowServiceABI,
        functionName: "depositedEth",
        args: [address]
      });

      if (feeEstimate > deposited) {
        console.log('requesting deposit of fee estimate');
        const request = await prepareSendTransaction({
          to: escrowAddress,
          value: feeEstimate
        });
        console.log("transfer completed");
        const receipt = await sendTransaction(request);
        await waitForTransaction(receipt);
      }

      console.log("lets send the nft!");
      // console.log(await client.readContract({
      //   address: escrowAddress,
      //   abi: erc721ABI,
      //   functionName: "ownerOf",
      //   args: [tokenId]
      // }));
      const request2 = await prepareWriteContract({
        address: nftAddress,
        abi: erc721ABI,
        functionName: "safeTransferFrom",
        args: [address, escrowAddress, tokenId, encoded]
      });

      const hash2 = await writeContract(request2.request);
      console.log(hash2);
      const res = await waitForTransaction(hash2);
      setExplorerLink(`https://ccip.chain.link/api/query?query=TRANSACTION_SEARCH_QUERY&variables=%7B%22msgIdOrTxnHash%22%3A%22${res.transactionHash}%22%7D`);
      getListNFTs(); // refresh nfts
    }
    catch (e) {
      console.log(e);
    }
    isSending(false);
  }

  useEffect(() => {

    const handler = (e) => {
      setChainSelector(e.relatedTarget.dataset.chainselector);
      setEscrowAddress(e.relatedTarget.dataset.escrowaddress);
      setNftAddress(e.relatedTarget.dataset.nftaddress);
      setSourceChainId(e.relatedTarget.dataset.sourcechainid);
      if (e.relatedTarget.dataset.sourcechainid != sourceChainId) {
        setExplorerLink("");
      }
    };
    document.getElementById('bridgenft').addEventListener('show.bs.modal', handler);

    return () => {
      document.getElementById('bridgenft')?.removeEventListener('show.bs.modal', handler);
    }
  }, []);

  useEffect(() => {
    if (chainSelector === '' || escrowAddress === '' || nftAddress === '' || sourceChainId === '') {
      return;
    }
    getListNFTs();
  }, [chainSelector, escrowAddress, nftAddress, sourceChainId]);

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
                      {nfts.length > 0 && !refreshing && <h6>Select NFT to Bridge</h6>}
                      {nfts.length > 0 && !refreshing && <Select data={nfts} onChange={(e) => setTokenId(e.id)} />}
                      {nfts.length === 0 && !refreshing && <div>
                        <p>You do not have any NFTs, why not claim a free NFT and try us out?</p>
                        <button onClick={async (e) => {
                          const res = await checkNetworkAndMint();
                          getListNFTs();
                        }} className="mdr cmn-btn" disabled={isLoading}>{isLoading ? "Claiming NFT ..." : "Claim a free NFT!"}</button>
                      </div>}
                      {refreshing && <div><div className="spinner-border text-primary" role="status">
                        <span className="sr-only "></span>
                      </div>
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
                      {explorerLink.length > 0 && <p><a href={explorerLink} target="_blank" rel="noreferrer">View CCIP Status</a></p>}
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
