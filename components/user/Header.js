"use client";

import Search from "@/components/Search";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ children }) {
  const path = usePathname();

  return (
    <header className="site-header">
      <div className="container-fluid">
        <nav className="navbar site-navigation">
          <div className="navbar-brand">
            <Link href="/user">
              <img src="/asset/img/logo.svg" alt="Logo" />
            </Link>
          </div>
          <Search>{children}</Search>
          <ul className="navbar-nav">
            {path != "/user" && (
              <li>
                <Link href="/user" className={path == "/user" ? "active" : ""}>
                  <span className="txt">Home</span>
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/user/history"
                className={path.includes("/user/history") ? "active" : ""}
              >
                <span className="icon">
                  <img
                    src="/asset/img/share-clock.png"
                    alt="History"
                    className="iconBlack"
                  />
                  <img
                    src="/asset/img/share-clock-blue.png"
                    alt="History"
                    className="iconBlue"
                  />
                </span>
                <span className="txt">History</span>
              </Link>
            </li>
            <li>
              <Link href="/user/logout">
                <span className="icon">
                  <img src="/asset/img/logout.png" alt="LogOut" />
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* container */}
    </header>
  );
}
