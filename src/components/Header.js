import React from "react";
import { NavLink } from "react-router-dom";

export default () => (
  <header className="Header-header">
    <h1 className="Header-h1">Ben wird sechs</h1>
    <nav className="Header-nav">
      <NavLink
        exact
        to="/"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Stationen
      </NavLink>
      <NavLink
        to="/about"
        className="Header-navLink"
        activeClassName="Header-isActive"
      >
        Geschenk
      </NavLink>
    </nav>
  </header>
);
