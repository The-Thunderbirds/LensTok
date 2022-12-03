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

const client = createReactClient({
  provider: studioProvider({ apiKey: import.meta.env.VITE_LIVEPEER_API_KEY }),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
