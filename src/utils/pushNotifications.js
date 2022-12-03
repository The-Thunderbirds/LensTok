import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";


function getCAIPAddress(address, chainID = "80001") {
    return `eip155:${chainID}:${address}`;
}

function getCAIPAddresses(addresses, chainID = "80001") {
    const new_addresses = []
    addresses.forEach((addr) => {
        new_addresses.push(getCAIPAddress(addr));
    })
    console.log(new_addresses);
    return new_addresses;
}

const PK = import.meta.env.VITE_CHANNEL_PK;
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);
const CHANNEL_ADDRESS = "0x872799857a381aA822052a8a62b4371ABE5d5d9c";


export const subscribe = async (wallet, account) => {
    await PushAPI.channels.subscribe({
        signer: await wallet.getSigner(),
        channelAddress: getCAIPAddress(CHANNEL_ADDRESS),
        userAddress: getCAIPAddress(account),
        onSuccess: () => {
            window.alert("Opt In Success");
            console.log('opt in success');
            fetch_subscriptions(account);
        },
        onError: () => {
            console.error('opt in error');
        },
        env: 'staging'
    });
}


export const unsubscribe = async (wallet, account) => {
    await PushAPI.channels.unsubscribe({
        signer: await wallet.getSigner(),
        channelAddress: getCAIPAddress(CHANNEL_ADDRESS),
        userAddress: getCAIPAddress(account),
        onSuccess: () => {
            window.alert("Opt Out Success");
            console.log('opt out success');
            fetch_subscriptions(account);
        },
        onError: () => {
            console.error('opt out error');
        },
        env: 'staging'
    });
}

export const fetch_notifications = async (account) => {
    const notifications = await PushAPI.user.getFeeds({
      user: getCAIPAddress(account),
      env: 'staging'
    });
    console.log(notifications);
    return notifications;
}


const fetch_subscriptions = async (account) => {
    const subscriptions = await PushAPI.user.getSubscriptions({
      user: getCAIPAddress(account),
      env: 'staging'
    });
    console.log(subscriptions);
}


export const sendNotificationToAll = async (title, body) => {
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 1, // broadcast
        identityType: 2,
        notification: {
          title: title,
          body: body
        },
        payload: {
          title: title,
          body: body,
          cta: '',
          img: ''
        },
        channel: getCAIPAddress(CHANNEL_ADDRESS),
        env: 'staging'
      });
      
      // apiResponse?.status === 204, if sent successfully!
      console.log('API repsonse: ', apiResponse);
    } catch (err) {
      console.error('Error: ', err);
    }
  }


  export const sendNotificationToOne = async (title, body, address) => {
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3, // target
        identityType: 2,
        notification: {
          title: title,
          body: body
        },
        payload: {
          title: title,
          body: body,
          cta: '',
          img: ''
        },
        recipients: getCAIPAddress(address), // recipient address
        channel: getCAIPAddress(CHANNEL_ADDRESS),
        env: 'staging'
      });
      
      // apiResponse?.status === 204, if sent successfully!
      console.log('API repsonse: ', apiResponse);
    } catch (err) {
      console.error('Error: ', err);
    }
  }
