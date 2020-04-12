import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { Layout, Affix } from "antd";
import { ApolloProvider } from "@apollo/react-hooks";
import { Listings } from "./section/Listings";
import "./styles/index.css";
import { Home, Host, Listing, NotFound, Login, AppHeader } from "./section";
import { Viewer } from "./lib/types";
const client = new ApolloClient({
  uri: "/api",
});

const initialValue: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialValue);
  return (
    <Router>
      <Layout id="app">
        <Affix offsetTop={0}>
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/host" component={Host} />
          <Route exact path="/listing/:id" component={Listing} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route
            exact
            path="/login"
            render={(props) => <Login setViewer={setViewer} {...props} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};
ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
