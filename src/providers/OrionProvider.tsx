import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { SettingsContext } from "./SettingsProvider";
import { getEnv } from "../config";

function createApolloClient(sessionId?: string) {
  const httpLink = createHttpLink({
    uri: getEnv("ORION_GQL_ENDPOINT"),
    headers: {
      authorization: sessionId ? `Bearer ${sessionId}` : "",
    },
  });
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
}

export const OrionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(
    () => createApolloClient()
  );
  const { gleevOperatorKey } = useContext(SettingsContext);

  useEffect(() => {
    if (gleevOperatorKey) {
      console.log("Authenticating...");
      fetch(`${getEnv("ORION_AUTH_ENDPOINT")}/anonymous-auth`, {
        method: "POST",
        body: JSON.stringify({ userId: gleevOperatorKey }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.sessionId) {
            setClient(createApolloClient(r.sessionId));
          } else {
            console.error("Missing sessionId in Orion auth response!");
          }
        })
        .catch((e) => console.error("Auth error:", e));
    }
  }, [gleevOperatorKey]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
