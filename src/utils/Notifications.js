// https://docs.push.org/developers/developer-tooling/push-sdk/quick-start
// https://staging.push.org/#/inbox

import { useEffect, useContext, useState } from "react";
import { ApolloContext } from "~/context/ApolloContext";
import { useWalletProvider } from "~/context/WalletProvider";

import * as PushAPI from "@pushprotocol/restapi";
import { EmbedSDK } from "@pushprotocol/uiembed";
import * as ethers from "ethers";
import {
  createSocketConnection,
  EVENTS
} from '@pushprotocol/socket';

function getCAIPAddress(address, chainID="80001"){
    return `eip155:${chainID}:${address}`;
}

function getCAIPAddresses(addresses, chainID="80001"){
    const new_addresses = []
    addresses.forEach((addr) => {
        new_addresses.push(getCAIPAddress(addr));
    })
    return new_addresses;
}


function Notifications() {
  const PK = import.meta.env.VITE_CHANNEL_PK;
  const Pkey = `0x${PK}`;
  const signer = new ethers.Wallet(Pkey);
  const CHANNEL_ADDRESS = "0x872799857a381aA822052a8a62b4371ABE5d5d9c";

  const { walletProvider, account } = useWalletProvider();
  const wallet = walletProvider;

  const pushSDKSocket = createSocketConnection({
    user: getCAIPAddress("0x62cAec6163FA3a5270e638f74d67490D60605bb2"),
    env: 'staging',
    socketOptions: { autoConnect: false }
  });

  pushSDKSocket.connect();

  pushSDKSocket.on(EVENTS.CONNECT, () => {
    console.log("Notification Service Started!");
  });

  pushSDKSocket.on(EVENTS.USER_FEEDS, (feedItem) => {
    console.log("New Notification!");
    console.log(feedItem);
  });

//   useEffect(() => {
//     if (account) { // 'your connected wallet address'
//       EmbedSDK.init({
//         chainId: 80001,
//         headerText: 'Hello Hacker Dashboard', // optional
//         targetID: 'sdk-trigger-id', // mandatory
//         appName: 'hackerApp', // mandatory
//         user: account, // mandatory
//         viewOptions: {
//             type: 'sidebar', // optional [default: 'sidebar', 'modal']
//             showUnreadIndicator: true, // optional
//             unreadIndicatorColor: '#cc1919',
//             unreadIndicatorPosition: 'top-right',
//         },
//         theme: 'dark',
//         onOpen: () => {
//           console.log('-> client dApp onOpen callback');
//         },
//         onClose: () => {
//           console.log('-> client dApp onClose callback');
//         }
//       });
//     }

//     return () => {
//       EmbedSDK.cleanup();
//     };
//   }, [account, 80001]);

  const sendNotification = async() => {

    const recipents = ["0x62cAec6163FA3a5270e638f74d67490D60605bb2", "0xcE7a2E0297C4031a2c4791D023c74fA3210496F1"];

    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 4, // subset
        identityType: 2,
        notification: {
          title: `New Video From Acc3`,
          body: `Checkout!`
        },
        payload: {
          title: `New Video From Acc3`,
          body: `Checkout!`,
          cta: '',
          img: ''
        },
        recipients: getCAIPAddresses(recipents),
        channel: getCAIPAddress(CHANNEL_ADDRESS),
        env: 'staging'
      });
      
      // apiResponse?.status === 204, if sent successfully!
      console.log('API repsonse: ', apiResponse);
    } catch (err) {
      console.error('Error: ', err);
    }
  }

  const subscribe = async() => {
    await PushAPI.channels.subscribe({
      signer: await wallet.getSigner(),
      channelAddress: getCAIPAddress(CHANNEL_ADDRESS),
      userAddress: getCAIPAddress(account),
      onSuccess: () => {
       console.log('opt in success');
      },
      onError: () => {
        console.error('opt in error');
      },
      env: 'staging'
    });
  }

  const unsubscribe = async() => {
    await PushAPI.channels.unsubscribe({
      signer: await wallet.getSigner(),
      channelAddress: getCAIPAddress(CHANNEL_ADDRESS),
      userAddress: getCAIPAddress(account),
      onSuccess: () => {
       console.log('opt out success');
      },
      onError: () => {
        console.error('opt out error');
      },
      env: 'staging'
    });
  }

  const fetch_notifications = async() => {
    const notifications = await PushAPI.user.getFeeds({
      user: getCAIPAddress("0x62cAec6163FA3a5270e638f74d67490D60605bb2"),
      env: 'staging'
    });
    console.log(notifications);
  }

  const fetch_spam_notifications = async() => {
    const spams = await PushAPI.user.getFeeds({
      user: getCAIPAddress("0x62cAec6163FA3a5270e638f74d67490D60605bb2"),
      spam: true,
      env: 'staging'
    });
    console.log(spams);
  }

  const fetch_subscriptions = async() => {
    const subscriptions = await PushAPI.user.getSubscriptions({
      user: getCAIPAddress("0x62cAec6163FA3a5270e638f74d67490D60605bb2"),
      env: 'staging'
    });
    console.log(subscriptions);
  }

  const fetch_channel_details = async() => {
    const channelData = await PushAPI.channels.getChannel({
      channel: getCAIPAddress(CHANNEL_ADDRESS),
      env: 'staging'
    });
    console.log(channelData);
  }

	// return (
	// 	<div>
	// 		<button onClick={sendNotification}>Send Notification</button>
    //   <br/>
    //   <button onClick={subscribe}>Subscribe</button>
    //   <br/>
    //   <button onClick={unsubscribe}>Un-Subscribe</button>
    //   <br/>
    //   <button onClick={fetch_notifications}>Fetch Notifications</button>
    //   <br/>
    //   <button onClick={fetch_spam_notifications}>Fetch Spam Notifications</button>
    //   <br/>
    //   <button onClick={fetch_subscriptions}>Fetch Subscriptions</button>
    //   <br/>
    //   <button onClick={fetch_channel_details}>Fetch Channel Details</button>
	// 	</div>

    // // <button id="sdk-trigger-id">trigger button</button>
	// );
    return (
    
        <div>Hello</div>
    );
}

export default Notifications;