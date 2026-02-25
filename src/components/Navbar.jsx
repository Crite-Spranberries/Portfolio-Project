import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoFlat from "../assets/vectors/logo-a-white.svg";
import "./Navbar.css";

const SECTION_IDS = ["home", "services", "portfolio", "about"];

function Navbar() {
  const { pathname } = useLocation();
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [menuOpen]);

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

  const closeMenu = () => setMenuOpen(false);

  const navLinks = (
    <>
      <li>
        <Link to="/" className={activeSection === "home" ? "active" : ""} onClick={closeMenu}>
          Home
        </Link>
      </li>
      <li>
        <Link
          to="/#services"
          className={activeSection === "services" ? "active" : ""}
          onClick={closeMenu}
        >
          Services
        </Link>
      </li>
      <li>
        <Link
          to="/#portfolio"
          className={activeSection === "portfolio" ? "active" : ""}
          onClick={closeMenu}
        >
          Portfolio
        </Link>
      </li>
      <li>
        <Link
          to="/#about"
          className={activeSection === "about" ? "active" : ""}
          onClick={closeMenu}
        >
          About
        </Link>
      </li>
      <li>
        <Link
          to="/contact"
          className={activeSection === "contact" ? "active" : ""}
          onClick={closeMenu}
        >
          Contact
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logoFlat} alt="Logo" />
        </Link>
      </div>
      <button
        type="button"
        className="navbar-hamburger"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="navbar-hamburger-line" />
        <span className="navbar-hamburger-line" />
        <span className="navbar-hamburger-line" />
      </button>
      <ul className="navbar-menu">{navLinks}</ul>
      <div
        className={`navbar-overlay ${menuOpen ? "navbar-overlay--open" : ""}`}
        aria-hidden="true"
        onClick={closeMenu}
      />
      <div className={`navbar-drawer ${menuOpen ? "navbar-drawer--open" : ""}`}>
        <button
          type="button"
          className="navbar-drawer-close"
          aria-label="Close menu"
          onClick={closeMenu}
        >
          <span aria-hidden>×</span>
        </button>
        <ul className="navbar-drawer-menu">{navLinks}</ul>
      </div>
    </nav>
  );
}

export default Navbar;
