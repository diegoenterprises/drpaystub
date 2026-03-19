import React from "react";
import { Link, withRouter } from "react-router-dom";
import { FaUser, FaLock, FaFileAlt, FaTachometerAlt, FaSignOutAlt, FaChartBar, FaWpforms } from "react-icons/fa";
import { connect } from "react-redux";
import "./styles.css";

const navItems = [
  { path: "/dashboard", icon: FaTachometerAlt, label: "Overview", exact: true },
  { path: "/dashboard/profile", icon: FaUser, label: "My Profile" },
  { path: "/dashboard/paystub", icon: FaFileAlt, label: "My Documents" },
  { path: "/dashboard/w2s", icon: FaWpforms, label: "My W-2s" },
  { path: "/dashboard/change-password", icon: FaLock, label: "Security" },
  { path: "/dashboard/admin", icon: FaChartBar, label: "Admin Panel", adminOnly: true },
];

class DashboardLayout extends React.Component {
  handleLogout = () => {
    localStorage.removeItem("tokens");
    localStorage.removeItem("drpaystub_auth");
    this.props.history.push("/login");
  };

  render() {
    const { location, userData } = this.props;
    const userInitial = userData?.firstName
      ? userData.firstName.charAt(0).toUpperCase()
      : "U";
    const userName = userData
      ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
      : "User";
    const userRole = userData?.role || "user";

    return (
      <div className="dashboard-shell">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-avatar">
              {userData?.image ? (
                <img src={userData.image} alt={userName} />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{userName}</span>
              <span className="sidebar-user-role">{userRole === "admin" ? "Administrator" : "Member"}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {navItems
              .filter((item) => !item.adminOnly || userRole === "admin")
              .map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path) && item.path !== "/dashboard";
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                  >
                    <Icon className="sidebar-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </nav>

          <div className="sidebar-footer">
            <button
              className="sidebar-nav-item sidebar-logout"
              onClick={this.handleLogout}
            >
              <FaSignOutAlt className="sidebar-nav-icon" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="dashboard-main">
          <div className="dashboard-content">{this.props.children}</div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state?.userData,
});

export default connect(mapStateToProps)(withRouter(DashboardLayout));
