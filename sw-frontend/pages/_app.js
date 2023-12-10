import Layout from "@/components/layout";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import "node_modules/react-modal-video/scss/modal-video.scss";
import { useEffect } from "react";

import { StakeWiseProvider } from "@/context/context";
import "@/styles/globals.scss";
import { WagmiConfig } from 'wagmi'
import { polygonMumbai, sepolia } from "viem/chains";
import dotenv from "dotenv";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

dotenv.config();

// 1. walletconnect project id
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Stakewise.Bet',
  url: 'https://stakewise.bet',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [polygonMumbai, sepolia]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
createWeb3Modal({ wagmiConfig, projectId, chains })

export default function App({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  if (Component.getLayout) {
    return Component.getLayout(
      <>
        <Head>
          <title>StakeWise.Bet - Wager your NFTs for MAD Gains</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="favicon.ico" />
        </Head>
        <StakeWiseProvider>
          <WagmiConfig config={wagmiConfig}>
            <Component {...pageProps} />
          </WagmiConfig>
        </StakeWiseProvider>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>StakeWise.Bet - Wager your NFTs for MAD Gains</title>
        <meta name="description" content="StakeWise.Bet - Multi-Chain NFT Wagers" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <StakeWiseProvider>
        <WagmiConfig config={wagmiConfig}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WagmiConfig>
      </StakeWiseProvider>
    </>
  );
}
