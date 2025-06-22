import React from "react";
import "./Header.scss";
import { FiBell } from "react-icons/fi";

export const Header = () => {
  return (
    <header className="oxm-header">
      <div className="oxm-header__search">
        <input type="text" placeholder="Search For a Game" />
      </div>
      <div className="oxm-header__actions">
        <FiBell className="icon-bell" />
        <img
          className="avatar"
          src="https://i.pravatar.cc/50"
          alt="User Avatar"
        />
      </div>
    </header>
  );
};
