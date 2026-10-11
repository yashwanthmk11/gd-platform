import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children, bare = false }) {
  return (
    <div className={`app-shell ${bare ? "app-shell-bare" : ""}`}>
      {!bare && <Navbar />}
      <main className="app-main">{children}</main>
      {!bare && (
        <footer className="site-footer">
          <p>
            © {new Date().getFullYear()} Podium · Group discussion practice by{" "}
            <a
              href="https://github.com/yashwanthmk11"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yashwanth M K
            </a>
          </p>
        </footer>
      )}
    </div>
  );
}
