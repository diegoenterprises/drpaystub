import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import SaurelliusLogo from "../SaurelliusLogo";
import ThemeToggle from "../ThemeToggle";
//vendor files

//custom scss
import "./Header.scss";
import { axios } from "../../HelperFunctions/axios";
import { upperFirst } from "lodash";
import actionCreater from "../../redux/actions/actionCreater";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

class Header extends Component {
  state = {
    stickyClass: false,
    responseData: "",
  };
  listenScrollEvent = (e) => {
    if (window.scrollY > 200) {
      this.setState({ stickyClass: true });
    } else {
      this.setState({ stickyClass: false });
    }
  };
  componentDidMount() {
    //for changing header css on scroll
    window.addEventListener("scroll", this.listenScrollEvent);
    // this.handleLogout =
    this.handleLogout = this.handleLogout.bind(this);

    this.handleGetUser();
  }
  handleLogout() {
    this.props.getUserDataSuccess(null);
    localStorage.removeItem("tokens");
    localStorage.removeItem("clickStartAstrosync");

    // return <Redirect to="/login" />;

    // this.props.history.push("/login");
    const redirectUrl = `/login`;
    window.location = redirectUrl;
  }

  handleGetUser = async () => {
    let url = process.env.REACT_APP_BACKEND_URL_LOCAL;
    if (process.env.REACT_APP_MODE === "live") {
      url = process.env.REACT_APP_FRONTEND_URL_LIVE;
    }
    const token = localStorage.getItem("tokens");
    const data = "";
    var config = {
      method: "get",
      url: `${url}api/auth/get-user`,
      headers: {
        Authorization: `bearer ${token}`,
      },
      data: data,
    };
    try {
      const response = await axios(config);
      this.props.getUserDataSuccess(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { userData } = this.props;
    return (
      <header
        className={`header ${this.state.stickyClass ? "nav-sticky" : ""}`}
      >
        <nav
          className={`navbar navbar-expand-sm container sticky-top navbar-light`}
        >
          <Link to="/" className="navbar-brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <SaurelliusLogo size={32} />
            <span className="gradient-text" style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.02em" }}>Saurellius</span>
          </Link>
          {/* Toggler/collapsibe Button */}
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navigation">
            <ul className="navbar-nav ml-auto mr-auto navigation-menu">
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target="#navigation"
              >
                <NavLink
                  exact
                  activeClassName="nav-active"
                  to="/"
                  className="nav-link"
                >
                  Home
                </NavLink>
              </li>
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target="#navigation"
              >
                {userData ? (
                  <NavLink
                    exact
                    activeClassName="nav-active"
                    to="/paystubs"
                    className="nav-link"
                  >
                    Saurellius
                  </NavLink>
                ) : (
                  <NavLink
                    exact
                    activeClassName="nav-active"
                    onClick={() =>
                      localStorage.setItem("clickStartAstrosync", true)
                    }
                    to="/login"
                    className="nav-link"
                  >
                    Saurellius
                  </NavLink>
                )}
              </li>
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target="#navigation"
              >
                { /* <NavLink
                  exact
                  activeClassName="nav-active"
                  to="/w2forms"
                  className="nav-link"
                >
                  W2 Forms
                </NavLink> */}
              </li>
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target="#navigation"
              >
                <NavLink
                  exact
                  activeClassName="nav-active"
                  to="/reviews"
                  className="nav-link"
                >
                  Reviews
                </NavLink>
              </li>
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target="#navigation"
              >
                <NavLink
                  exact
                  activeClassName="nav-active"
                  to="/contact"
                  className="nav-link"
                >
                  Contact
                </NavLink>
              </li>
              {/* ─── Mobile-only auth links ─── */}
              {!userData && (
                <li
                  className="nav-item mobile-only-nav"
                  data-toggle="collapse"
                  data-target="#navigation"
                >
                  <NavLink
                    exact
                    activeClassName="nav-active"
                    to="/login"
                    className="nav-link"
                    onClick={() => localStorage.removeItem("clickStartAstrosync")}
                  >
                    Login
                  </NavLink>
                </li>
              )}
              {userData && (
                <>
                  <li
                    className="nav-item mobile-only-nav"
                    data-toggle="collapse"
                    data-target="#navigation"
                  >
                    <NavLink
                      exact
                      activeClassName="nav-active"
                      to="/dashboard/profile"
                      className="nav-link"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li
                    className="nav-item mobile-only-nav"
                    data-toggle="collapse"
                    data-target="#navigation"
                  >
                    <NavLink
                      exact
                      activeClassName="nav-active"
                      to="/login"
                      onClick={this.handleLogout}
                      className="nav-link"
                    >
                      Logout
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="stub-button">
            <Link
              to={userData ? "/paystubs" : "/login"}
              id="stubButton"
              className="btn btn-secondary"
              onClick={() =>
                !userData && localStorage.setItem("clickStartAstrosync", true)
              }
            >
              Start Saurellius
            </Link>

            {
              !userData && (
                <div className="stub-button">
                  <Link
                    to="/login"
                    id="loginButton"
                    onClick={() =>
                      localStorage.removeItem("clickStartAstrosync")
                    }
                    className="btn btn-secondary"
                  >
                    Login
                  </Link>
                </div>
              )
              //  : (
              //   <div className="stub-button">
              //     <button
              //       onClick={this.handleLogout}
              //       id="logoutButton"
              //       className="btn btn-secondary"
              //     >
              //       Logout
              //     </button>
              //   </div>
              // )
            }
          </div>
          {userData && (
            <div className="stub-button">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  {upperFirst(userData?.firstName) +
                    " " +
                    upperFirst(userData?.lastName)}
                </button>
                <div className="dropdown-menu">
                  <NavLink
                    exact
                    activeClassName="nav-active"
                    to="/dashboard/profile"
                    className="nav-link"
                  >
                    Dashboard
                  </NavLink>
                  {/* <a className="dropdown-item" href="/dashboard/profile">
                    Dashboard
                  </a> */}

                  <NavLink
                    exact
                    activeClassName="nav-active"
                    to="/login"
                    onClick={this.handleLogout}
                    className="nav-link"
                  >
                    Logout
                  </NavLink>
                  {/* <a className="dropdown-item" onClick={this.handleLogout}>
                    Logout
                  </a> */}
                </div>
              </div>
            </div>
          )}
          <ThemeToggle />
        </nav>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state?.userData,
});

export default connect(mapStateToProps, {
  getUserDataSuccess: actionCreater.getUserDataSuccess,
})(Header);
