import React, { useEffect, useState } from "react";
import { OpenSeaPort, Network, API_BASE_RINKEBY, EventType } from "opensea-js";

const NFT_CONTRACT_ADDRESS = "0x2c9F4969BcE3107b43b4776D7B517dc4A373040C";

export const MetaMask = () => {
  const [account, setAccount] = useState();
  const { ethereum } = window;
  const seaport = new OpenSeaPort(ethereum, {
    networkName: Network.Rinkeby,
    apiBaseUrl: API_BASE_RINKEBY,
  });
  const fetchData = async () => {
    const res = await seaport.api.getAssets({
      owner: account,
    });
    // const res = await seaport.api.getOrders({
    //   owner: account,
    // });
    console.log("🚀 ~ res", res);
    // const { orders, count } = await seaport.api.getOrders({
    //   maker: this.state.onlyByMe ? accountAddress : undefined,
    //   owner: this.state.onlyForMe ? accountAddress : undefined,
    //   side: this.state.side,
    //   bundled: this.state.onlyBundles ? true : undefined
    //   // Possible query options:
    //   // 'asset_contract_address'
    //   // 'taker'
    //   // 'token_id'
    //   // 'token_ids'
    //   // 'sale_kind'

    // }, this.state.page)

    // this.setState({ orders, total: count })
  };
  const createSellOrder = async () => {
    console.log("Auctioning an item for a fixed price...");
    const fixedPriceSellOrder = await seaport.createSellOrder({
      asset: {
        tokenId: "9",
        tokenAddress: NFT_CONTRACT_ADDRESS,
      },
      startAmount: 0.08,
      expirationTime: 0,
      accountAddress: account,
    });
    console.log(`Successfully created a fixed-price sell order! ${fixedPriceSellOrder.asset.openseaLink}\n`);
  };
  const createBuyOrder = async () => {
    console.log("Auctioning an item for a fixed price...");
    const offer = await seaport.createBuyOrder({
      asset: {
        tokenId: "35227045098423169601976404215786444024230025373824518128793712836509794566145",
        tokenAddress: "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656",
        schemaName: "ERC1155",
      },
      accountAddress: account,
      // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
      startAmount: 0.12,
    })
    console.log(`Successfully created a fixed-price sell order! ${offer.asset.openseaLink}\n`);
  };
  const cancelOrder = async () => {
    console.log("Auctioning an item for a fixed price...");
     const order = await seaport.api.getOrder({
        asset_contract_address: "0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656",
        token_id: "35227045098423169601976404215786444024230025373824518128793712836509794566145",
      });
      
      await seaport.cancelOrder({
        accountAddress: account,
        order
      });
    console.log(`Successfully cancel order!`);
  };
  const clickHandler = async () => {
    console.log("clickHandler");
    // fetchData();
    // createSellOrder()
    createBuyOrder()
    // cancelOrder()
  };

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const curr_account = accounts[0];
      console.log("🚀 ~ account", curr_account);
      setAccount(curr_account);
    };
    const { ethereum } = window;
    if (typeof ethereum === "undefined") {
      console.log("Please install MetaMask!");
      return;
    }
    console.log("MetaMask is installed!");
    getAccount();
    seaport.addListener(EventType.CancelOrder, ({ order, accountAddress }) => {
      console.info('cancel');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <button onClick={clickHandler}>click me</button>
    </div>
  );
};
