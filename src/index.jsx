import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./app/store";
import { BrowserRouter } from "react-router-dom";
import { WalletProviderProvider } from "./context/WalletProvider";
import { ApolloContextProvider } from "./context/ApolloContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletProviderProvider>
      <ApolloContextProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ApolloContextProvider>
    </WalletProviderProvider>
  </React.StrictMode>
);
