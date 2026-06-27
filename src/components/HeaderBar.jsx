import Logo from "./Logo";

function HeaderBar() {
  return (
    <header className="dash-header">
      <Logo />
      <div className="header-actions">
        <span className="welcome-pill">Dashboard</span>
      </div>
    </header>
  );
}

export default HeaderBar;
