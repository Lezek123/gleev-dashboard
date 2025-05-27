import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
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

type AuthInfo = {
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthInfo>({ isAuthenticated: false });

export const OrionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(
    () => createApolloClient()
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
            setIsAuthenticated(true);
          } else {
            console.error("Missing sessionId in Orion auth response!");
          }
        })
        .catch((e) => console.error("Auth error:", e));
    }
  }, [gleevOperatorKey]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ isAuthenticated }}>
        {children}
      </AuthContext.Provider>
    </ApolloProvider>
  );
};
