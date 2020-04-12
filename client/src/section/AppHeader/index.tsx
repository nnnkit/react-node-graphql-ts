import React from "react";
import { Layout } from "antd";

import logo from "./assets/tinyhouse-logo.png";
import { MenuItems } from "./MenuItems";
import { Viewer } from "../../lib/types";

const { Header } = Layout;
interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}
export const AppHeader = ({ viewer, setViewer }: Props) => {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <img src={logo} alt="Logo" />
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};
