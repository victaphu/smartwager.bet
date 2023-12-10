import Link from "next/link";
import Select from "../select/Select";
import { useEffect, useState } from "react";
import { erc721ABI, useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import common from "../common/common";
import { waitForTransaction } from "@wagmi/core";

const WithdrawTab = () => {
  const { address } = useAccount();
  const [balances, setBalances] = useState({sample:0, claim: 0});
  
  const { config, error } = usePrepareContractWrite({
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

  const { writeAsync, isLoading } = useContractWrite(config);

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
    console.log(sampleNFT.data, claimNote.data);
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
      id="withdraw"
      role="tabpanel"
      aria-labelledby="withdraw-tab"
    >
      <div className="deposit-with-tab withdraw">
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
              <h5>Withdraw NFTs</h5>
              <p className="para-area">

              </p>
              <div className="address-bar">
                <p>Actions</p>
                <div className="input-area">
                  <button type="button" className="cmn-btn firstTeam" onClick={async () => {
                    const res = await writeAsync?.();
                    await waitForTransaction(res);
                    sampleNFT.refetch()
                    claimNote.refetch()
                  }} disabled={isLoading}>{isLoading ? "Minting Sample ERC721" : "Mint Sample ERC721"}</button>
                  <button type="button" className="cmn-btn firstTeam" data-bs-toggle="modal" data-bs-target="#bridgenft">Withdraw Claim Note</button>
                </div>

                <p>Faucets</p>
                <div className="input-area" style={{textAlign: 'center'}}>
                  <button type="button" className="cmn-btn firstTeam" onClick={() => window.open('https://faucet.polygon.technology/')}>Get more Matic</button>
                  <button type="button" className="cmn-btn firstTeam" onClick={() => window.open('https://sepoliafaucet.com/')}>Get more Sepolia</button>
                </div>
              </div>
              <div className="bottom-area">
                <div className="single-item">
                  <h6>Important :</h6>
                  <p>
                    This is a demo, so if you are out of Mumbai tokens go grab some using a faucet. You can also mint a few free NFTs to test out Smart Wager
                  </p>
                </div>
                <div className="single-item">
                  <h6>Notice :</h6>
                  <p>
                    When withdrawing Claim Notes, the claim is burnt and sent via CCIP to the source NFT chain. The token is then deposited into your wallet in
                    the source chain. 
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

export default WithdrawTab;
