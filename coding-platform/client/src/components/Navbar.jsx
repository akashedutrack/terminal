import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <Link to="/" className="brand">🏆 CodeArena</Link>
      <div className="links">
        <Link to="/problems">Problems</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/dashboard">Dashboard</Link>
        {user ? (
          <>
            <span style={{ color: "var(--text-dim)" }}>Hi, {user.username}</span>
            <button className="secondary" onClick={() => { logout(); navigate("/login"); }}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}
