import React, { useEffect, useRef } from "react";
import { Card, Layout, Typography } from "antd";
import { Viewer } from "../../lib/types";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { AuthUrl as AuthUrlData } from "../../graphql/queries/AuthUrl/__generated__/AuthUrl";
import { AUTH_URL } from "../../graphql/queries";
import {
  LogIn as LogInData,
  LogInVariables,
} from "../../graphql/mutation/LogIn/__generated__/LogIn";
import { LOG_IN } from "../../graphql/mutation";
const { Content } = Layout;
const { Text, Title } = Typography;
interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
      }
    },
  });
  const logInRef = useRef(logIn);
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);
  async function handleLogIn() {
    try {
      const { data } = await client.query<AuthUrlData>({ query: AUTH_URL });
      window.location.href = data.authUrl;
    } catch (error) {}
  }
  return (
    <Content className="log-in">
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Login to TinyHouse!
          </Title>
          <Text>Sign in with google to start using the app.</Text>
        </div>
        <button className="log-in-card_googel-button" onClick={handleLogIn}>
          Sign In with google
        </button>
        {/* <Text type="secondary">
          Note: Though this you'll be able to effectively sign in with your
          Google account.
        </Text> */}
      </Card>
    </Content>
  );
};
