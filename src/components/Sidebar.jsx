import { NavLink } from "react-router-dom";

function Sidebar({ onLogout }) {
  return (
    <aside className="dash-sidebar" aria-label="Sidebar menu">
      <div>
        <div className="menu-title">Menu</div>
        <nav>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `menu-item${isActive ? " is-active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `menu-item${isActive ? " is-active" : ""}`
            }
          >
            Leads
          </NavLink>
        </nav>
      </div>

      <button
        type="button"
        className="ghost-btn sidebar-logout"
        onClick={onLogout}
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
