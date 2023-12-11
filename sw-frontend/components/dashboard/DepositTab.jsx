import { useEffect, useState } from "react";
import { erc721ABI, useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import common from "../common/common";
import { waitForTransaction } from "@wagmi/core";
import BridgeTokenModal from "../modals/BridgeTokenModal";
import useMintSample from "../hooks/useMintSampleNFT";

const DepositTab = () => {
  const { address } = useAccount();
  const [balances, setBalances] = useState({ sample: 0, claim: 0 });
  const { checkNetworkAndMint, isLoading } = useMintSample();

  // read - sepolia
  const sampleNFT = useContractRead({
    chainId: common.chain.sepolia,
    address: common.sampleNft,
    abi: erc721ABI,
    args: [address || common.sampleNft],
    functionName: "balanceOf"
  });

  // read - polygon mumbai
  const claimNote = useContractRead({
    chainId: common.chain.mumbai,
    address: common.claimNote,
    abi: erc721ABI,
    args: [address || common.claimNote],
    functionName: "balanceOf"
  });

  useEffect(() => {
    if (isNaN(Number(sampleNFT.data)) || isNaN(Number(claimNote.data))) {
      return;
    }

    setBalances({
      sample: sampleNFT.data,
      claim: claimNote.data
    })

  }, [sampleNFT.data, claimNote.data])

  return (
    <div
      className="tab-pane fade"
      id="deposit"
      role="tabpanel"
      aria-labelledby="deposit-tab"
    >
      <div className="deposit-with-tab">
        <div className="row">
          <div className="col-xxl-4 col-xl-5">
            <div className="balance-area">
              <div className="head-area d-flex align-items-center justify-content-between">
                <h5 className="">Current Balance</h5>
              </div>
              <h6>
                {Number(balances.sample) || 0} <span>SampleNFT (Sepolia)</span>
              </h6>

              <h6>
                {Number(balances.claim) || 0} <span>Claim Note (Stakewise)</span>
              </h6>
            </div>
          </div>
          <div className="col-xxl-8 col-xl-7">
            <div className="right-area">
              <h5>Deposit NFTs</h5>
              <p className="para-area">

              </p>
              <div className="address-bar">
                <p>Actions</p>
                <div className="input-area">
                  <button type="button" className="cmn-btn firstTeam" disabled={isLoading} onClick={async () => {
                    await checkNetworkAndMint();
                    sampleNFT.refetch()
                    claimNote.refetch()
                  }}>{isLoading ? "Minting Sample NFT ..." : "Mint Sample ERC721"}</button>
                  <button type="button" className="cmn-btn firstTeam" data-bs-toggle="modal" data-bs-target="#bridgenft"
                    data-chainselector={common.chainSelector.mumbai} data-escrowaddress={common.sepolia.chainlinkTokenEscrowService} data-nftaddress={common.sampleNft} data-sourcechainid={common.chain.sepolia}>Bridge to StakeWise</button>
                </div>

                <p>Faucets</p>
                <div className="input-area" style={{ textAlign: "center" }}>
                  <button type="button" className="cmn-btn firstTeam" onClick={() => window.open("https://faucet.polygon.technology/")}>Get more Matic</button>
                  <button type="button" className="cmn-btn firstTeam" onClick={() => window.open("https://sepoliafaucet.com/")}>Get more Sepolia</button>
                </div>
              </div>
              <div className="bottom-area">
                <div className="single-item">
                  <h6>Important :</h6>
                  <p>
                    This is a demo, so if you are out of Mumbai tokens go grab some using a faucet. You can also mint a few free NFTs to test out StakeWise.Bet
                  </p>
                </div>
                <div className="single-item">
                  <h6>Notice :</h6>
                  <p>
                    Once the NFT is minted, you can bridge the token into StakeWise (Mumbai) and start challenging everyone online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositTab;
