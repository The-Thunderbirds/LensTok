import React, { useEffect, useReducer, useContext } from "react";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import fetch from "cross-fetch";

import { useWalletProvider } from "./WalletProvider";

import {
  GET_CHALLENGE,
  AUTHENTICATION,
  VERIFY,
  GET_PROFILES,
  GET_PUBLICATIONS,
  EXPLORE_PUBLICATIONS,
  HAS_TX_BEEN_INDEXED,
  CREATE_POST_TYPED_DATA,
  GET_PUBLICATION,
  CREATE_PROFILE
} from "../graphql";

// const API_URL = 'https://api.lens.dev'
const API_URL = 'https://api-mumbai.lens.dev/'

export const ApolloContext = React.createContext();

const httpLink = new HttpLink({
  uri: API_URL,
  fetch,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("lensAPIAccessToken");

  if (
    operation &&
    operation.variables &&
    operation.variables.request &&
    operation.variables.request.sortCriteria
  ) {
  } else {
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      }
    });
  }
  // Use the setContext method to set the HTTP headers.

  // Call the next link in the middleware chain.
  return forward(operation);
});


const apolloReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROFILES":
      return { profiles: action.payload };
    case "SET_PROFILE":
      console.log(action.payload);
      let profile = action.payload;
      let id = profile.id;
      return {
        ...state,
        profiles: state.profiles.map((profile) => {
          if (profile.id === id) {
            return action.payload;
          } else return profile;
        }),
      };
    case "CURRENT_PROFILE":
      return { ...state, currentProfile: action.payload };
    default:
      return { ...state }
  }
};


function ApolloContextProvider({ children }) {
  const { walletProvider, account } = useWalletProvider();
  const wallet = walletProvider;

  const [apolloContext, dispatch] = useReducer(apolloReducer, {});

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });

  useEffect(() => {
    if (wallet !== null && account !== null && account !== undefined) {
      console.log("connecting");
      getProfilesByAccount();
    }
  }, [account]);

  const generateChallenge = (address) => {
    return apolloClient.query({
      query: gql(GET_CHALLENGE),
      variables: {
        request: {
          address,
        },
      },
    });
  };

  const authenticate = (address, signature) => {
    return apolloClient.mutate({
      mutation: gql(AUTHENTICATION),
      variables: {
        request: {
          address,
          signature,
        },
      },
    });
  };

  const verify = (accessToken) => {
    return apolloClient.query({
      query: gql(VERIFY),
      variables: {
        request: {
          accessToken,
        },
      },
    });
  };

  const getProfilesRequest = (request) => {
    return apolloClient.query({
      query: gql(GET_PROFILES),
      variables: {
        request,
      },
    });
  };

  async function signChallenge(address) {
    const signer = await wallet.getSigner();
    const challengeResponse = await generateChallenge(address);
    const signature = await signer.signMessage(
      challengeResponse.data.challenge.text
    );

    const accessTokens = await authenticate(address, signature);
    console.log(accessTokens.data);
    localStorage.setItem(
      "lensAPIAccessToken",
      accessTokens.data.authenticate.accessToken
    );
    localStorage.setItem(
      "lensAPIRefreshToken",
      accessTokens.data.authenticate.refreshToken
    );
  }

  async function login() {
    let authenticationToken = localStorage.getItem("lensAPIAccessToken");
    console.log(authenticationToken);
    if (authenticationToken) {
      let isAuthenticated = (await verify(authenticationToken)).data.verify;
      console.log(isAuthenticated);
      if (!isAuthenticated) {
        await signChallenge(account);
      }
    } else {
      await signChallenge(account);
    }
  }

  async function getProfilesByProfileIds(request) {
    const response = await getProfilesRequest(request);
    return response;
  }

  async function getProfilesByAccount() {
    await login(account);

    let request = { ownedBy: account };
    const profilesFromProfileIds = await getProfilesRequest(request);
    console.log(profilesFromProfileIds)
    dispatch({
      type: "SET_PROFILES",
      payload: profilesFromProfileIds.data.profiles.items,
    });

    if (profilesFromProfileIds.data.profiles.items) {
      console.log(profilesFromProfileIds);
      dispatch({ type: "CURRENT_PROFILE", payload: 0 });
    }
  }

  async function getPublications(getPublicationQuery) {
    return apolloClient.query({
      query: gql(GET_PUBLICATIONS),
      variables: {
        request: getPublicationQuery,
      },
    });
  }

  async function hasTxBeenIndexed(txHash) {
    return apolloClient.query({
      query: gql(HAS_TX_BEEN_INDEXED),
      variables: {
        request: {
          txHash,
        },
      },
      fetchPolicy: "network-only",
    });
  }

  const pollUntilIndexed = async (txHash) => {
    while (true) {
      console.log(txHash);
      const result = await hasTxBeenIndexed(txHash);
      const response = result.data.hasTxHashBeenIndexed;
      if (response.__typename === "TransactionIndexedResult") {
        if (response.metadataStatus) {
          if (response.metadataStatus.status === "SUCCESS") {
            return response;
          }

          if (
            response.metadataStatus.status ===
            "METADATA_VALIDATION_FAILED"
          ) {
            throw new Error(response.metadataStatus.reason);
          }
        } else {
          if (response.indexed) {
            return response;
          }
        }

        console.log(response);
        // sleep for a second before trying again
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      console.log("out of loop");
      // it got reverted and failed!
      throw new Error(response.reason);
    }
  };

  async function createPostTypedData(createPostTypedDataRequest) {
    await login(account);
    return apolloClient.mutate({
      mutation: gql(CREATE_POST_TYPED_DATA),
      variables: {
        request: createPostTypedDataRequest,
      },
    });
  }

  async function explorePublications() {
    console.log("Exploring publications")
    return apolloClient.query({
      query: gql(EXPLORE_PUBLICATIONS),
      variables: {
        request: {
          sources: ["lenstube"],
          sortCriteria: "LATEST",
          publicationTypes: ["POST"],
        },
      },
      fetchPolicy: "network-only",
    });
  }

  async function getPublication(publicationId) {
    console.log(publicationId);
    return apolloClient.query({
      query: gql(GET_PUBLICATION),
      variables: {
        request: {
          publicationId: publicationId,
        },
      },
    });
  }

	async function createProfile(createProfileRequest) {
		await login(account);
		return apolloClient.mutate({
			mutation: gql(CREATE_PROFILE),
			variables: {
				request: createProfileRequest,
			},
		});
	}


  return (
    <ApolloContext.Provider
      value={{
        apolloClient,
        authenticate,
        getProfiles: getProfilesByAccount,
        getProfilesByProfileIds,
        verify,
        apolloContext,
        dispatch,
        getPublications,
        hasTxBeenIndexed,
        pollUntilIndexed,
        createPostTypedData,
        explorePublications,
        getPublication,
        createProfile
      }}>
      {children}
    </ApolloContext.Provider>
  )
}

const useApolloProvider = () => useContext(ApolloContext);
export { ApolloContextProvider, useApolloProvider };