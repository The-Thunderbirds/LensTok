import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./app/store";
import { BrowserRouter } from "react-router-dom";
import { WalletProviderProvider } from "./context/WalletProvider";
import { ApolloContextProvider } from "./context/ApolloContext";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import { HuddleClientProvider, getHuddleClient } from '@huddle01/huddle01-client';

const client = createReactClient({
  provider: studioProvider({ apiKey: import.meta.env.VITE_LIVEPEER_API_KEY }),
});
const huddleClient = getHuddleClient(import.meta.env.VITE_HUDDLE_API_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HuddleClientProvider client = {huddleClient} >
    <LivepeerConfig client={client}>
    <WalletProviderProvider>
      <ApolloContextProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ApolloContextProvider>
    </WalletProviderProvider>
    </LivepeerConfig>
    </HuddleClientProvider>
  </React.StrictMode>
);
