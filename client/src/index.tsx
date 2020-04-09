import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { Listings } from "./section/Listings";

const client = new ApolloClient({
  uri: "/graphql",
});
ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Listings />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
