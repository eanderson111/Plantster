import React from "react";
import logo from "../../assets/images/Plantster_color/Plantster_green_B.png";

function Nav1() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light static-top">
      <a className="navbar-brand">
        <img src={logo} height="65" alt="" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarResponsive">
        <ul className="navbar-nav ml-auto">
        <li className="nav-item">
            <a href="/Profile" className="nav-link">
              Profile
            </a>
          </li>

          <li className="nav-item">
            <a href="/" className="nav-link">
              Logout
            </a>
          </li>
          
        </ul>
      </div>
    </nav>
  );
}

export default Nav1;
