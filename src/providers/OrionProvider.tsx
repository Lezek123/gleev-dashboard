import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { PropsWithChildren, useContext, useEffect, useRef } from "react";
import { SettingsContext } from "./SettingsProvider";
import { getEnv } from "../config";

export const OrionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const client = useRef<ApolloClient<NormalizedCacheObject> | null>(null);
  if (!client.current) {
    const httpLink = createHttpLink({
      uri: getEnv("ORION_GQL_ENDPOINT"),
      credentials: "include",
    });
    client.current = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    });
  }
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
        .then((r) => console.log("Auth response:", r))
        .catch((e) => console.error("Auth error:", e));
    }
  }, [gleevOperatorKey]);

  return <ApolloProvider client={client.current}>{children}</ApolloProvider>;
};
