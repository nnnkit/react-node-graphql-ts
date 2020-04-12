import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { Layout, Affix, Spin } from "antd";
import { ApolloProvider, useMutation } from "@apollo/react-hooks";
import { Listings } from "./section/Listings";
import "./styles/index.css";
import { Home, Host, Listing, NotFound, Login, AppHeader } from "./section";
import { Viewer } from "./lib/types";
import { LogIn as LogInData } from "./graphql/mutation/LogIn/__generated__/LogIn";
import { LOG_IN } from "./graphql/mutation";
import { AppHeaderSkeleton } from "./lib/components";
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
  const [logIn, { error }] = useMutation<LogInData>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
      }
    },
  });
  const logInRef = useRef(logIn);
  useEffect(() => {
    logInRef.current();
  }, []);
  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching App" />
        </div>
      </Layout>
    );
  }
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
