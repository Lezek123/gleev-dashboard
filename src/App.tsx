import React from "react";
import styled from "styled-components";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import VideosList from "./components/video/VideosList";
import { colors } from "./styles";

type AppProps = {
  className?: string;
};

const client = new ApolloClient({
  uri: "https://orion.gleev.xyz/graphql",
  cache: new InMemoryCache(),
});

function App({ className }: AppProps) {
  return (
    <div className={className}>
      <ApolloProvider client={client}>
        <VideosList />
      </ApolloProvider>
    </div>
  );
}

export default styled(App)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${colors.bg0};
`;
