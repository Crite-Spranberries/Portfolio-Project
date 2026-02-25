import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoFlat from "../assets/vectors/logo-a-white.svg";
import "./Navbar.css";

const SECTION_IDS = ["home", "services", "portfolio", "about"];

function Navbar() {
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(pathname === "/contact" ? "contact" : "home");
      return;
    }

    const getActive = () => {
      const trigger = window.scrollY + window.innerHeight * 0.35;
      let current = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= trigger) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    getActive();
    window.addEventListener("scroll", getActive, { passive: true });
    return () => window.removeEventListener("scroll", getActive);
  }, [pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logoFlat} alt="Logo" />
        </Link>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/" className={activeSection === "home" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/#services"
            className={activeSection === "services" ? "active" : ""}
          >
            Services
          </Link>
        </li>
        <li>
          <Link
            to="/#portfolio"
            className={activeSection === "portfolio" ? "active" : ""}
          >
            Portfolio
          </Link>
        </li>
        <li>
          <Link
            to="/#about"
            className={activeSection === "about" ? "active" : ""}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className={activeSection === "contact" ? "active" : ""}
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
