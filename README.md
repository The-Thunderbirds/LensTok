# Lenstok

Short-form video content is on a rise all over the world. Social Media giants are integrating short-form video content mechanisms to create more engagement among users and creators. But these companies generate proprietary software and own all the data on their platforms
Introducing LensTok, a decentralized short-form video content platform built using composable and decentralized social graph powered by Lens Protocol. The users have full control over their online social presence and creators are no anymore at the mercy of closed-source algorithms to generate engagement

We have developed a lot of features to get you started on our platform.

- Social Login: We use Biconomy's social login SDK to ease out the transition for new users and bypass the overhead of setting up crypto wallets
- Upload videos: In our platform, content creators get the ability to publish their content all over the world in a decentralized manner empowered using Livepeer Video API (On Demand) and IPFS / Filecoin's Web3.Storage.
Explore Timeline and Following Timeline: Users get to choose to browse through content on the platform in both explore and their following creator's timeline formats
- Notifications: No user can miss out on any updates on new video uploads from their favourite content creator. The notifications are powered by Push Protocol
- Collect Posts as NFT: We incentivize human interactions on our platform. Hence we use the World Coin Verification system to initially verify an individual as human and then only enable them to collect Posts as NFTs. Creators of these posts get notified instantly using Push notifications
- Profile Pages: We enable users to go through the videos uploaded by other users/creators and videos collected by them through their profile pages
- Top fans private call: We provide the creators to see their top fans on our platform and provide them an option to have 1-1 video calls with them in a decentralized manner powered by Huddle01 video conferencing

## Challenges we ran into
We spent the first few hours ideating and brainstorming with fellow hackers and mentors about our ideas and possible improvements.
We tried to keep the UI simplistic and familiar to a web2 user with the underlying features of web3.
Web3 protocols are evolving at a very rapid pace, hence the documents get outdated very frequently which caused us a little bit of trouble.
Picking up the best suitable SDK or partner for each of our use cases was difficult. Though as a tradeoff, they made our work easier with their functionalities.
Our platform uses the major advancements by web3 protocols to provide users with a simple, user-friendly, and secure platform-
- 📔Social graph by Lens Protocol
- 🔔Notifications to users and creators by Push Protocol
- 🌐Social Login SDK by Biconomy
- 📽️On Demand Video Upload by Livepeer
- 👱‍♂️Human verification for Collecting NFTs by WorldCoin
- 📦Distributed storage powered by FileCoin (web3.storage)
- 📱1-1 call for creators and their top fans by Huddle01
- 📈Lens Subgraph queries by The Graph
- ⚡Lightning fast transactions powered by Polygon network

## ⌛Future Scope

- Provide creators with the flexibility to choose from different types of follow and collect modules presented by the Lens Protocol.
- Introduce a community reward system to increase quality engagement.
- Develop an algorithm to determine the top fans for each creator
- Gas Relays by Biconomy to create gasless creation
- Add more basic functionalities like comment, chat, etc

## Installation

Clone the repository to your local computer and install the dependencies.

```
$ npm install
```

## Run App

To start app run the following command.

```
$ npm run dev
```

