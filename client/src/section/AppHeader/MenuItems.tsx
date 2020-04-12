import React from "react";
import { Button, Menu, Avatar } from "antd";
import { HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";

import { Link, useHistory } from "react-router-dom";
import { Viewer } from "../../lib/types";
import { useMutation } from "@apollo/react-hooks";
import { LogOut } from "../../graphql/mutation/LogOut/__generated__/LogOut";
import { LOG_OUT } from "../../graphql/mutation";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../lib/utils";

const { Item, SubMenu } = Menu;
interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}
export const MenuItems = ({ viewer, setViewer }: Props) => {
  let history = useHistory();
  const [logOut] = useMutation(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        displaySuccessNotification("You are successfully logged out!");
        history.push("/");
      }
    },
    onError: (err) => {
      displayErrorMessage("Sorry Something went wrong!");
    },
  });
  function handleLogout() {
    logOut();
  }
  const subMenuLogin = viewer.id ? (
    <SubMenu title={<Avatar src={viewer.avatar || ""} />}>
      <Item key="/user">
        <Link to={`/user/${viewer.id}`}>
          <UserOutlined />
          Profile
        </Link>
      </Item>
      <Item key="/logout">
        <div onClick={handleLogout}>
          <LogoutOutlined />
          Logout
        </div>
      </Item>
    </SubMenu>
  ) : (
    <Item>
      <Link to="/login">
        <Button type="primary">Sign In</Button>
      </Link>
    </Item>
  );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <HomeOutlined />
          Host
        </Link>
      </Item>

      {subMenuLogin}
    </Menu>
  );
};
