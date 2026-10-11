import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="brand">
          <span className="brand-mark" aria-hidden="true" />
          Podium
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/create-session">Create</NavLink>
              <NavLink to="/join">Join</NavLink>
              <NavLink to="/feedback">Feedback</NavLink>
              <span className="nav-user">{user?.name?.split(" ")[0]}</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
