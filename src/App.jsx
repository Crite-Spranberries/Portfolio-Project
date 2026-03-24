import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Landing from "./pages/Landing";
import Bebop from "./pages/Bebop";
import NotFound from "./pages/NotFound";
import PortfolioDetail from "./pages/PortfolioDetail";
import "./App.css";
import { useEffect, useState } from "react";

const NAVBAR_OFFSET = 88;

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        const headerFirstSections = ["services", "portfolio", "about"];
        const id = hash.slice(1);
        if (headerFirstSections.includes(id) && el.classList.contains("home-section")) {
          const title = el.querySelector(".home-section__title");
          if (title) {
            const scrollToHeaderUnderNav = () => {
              const top = title.getBoundingClientRect().top + window.scrollY;
              const targetY = top - NAVBAR_OFFSET;
              window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
            };
            requestAnimationFrame(() => requestAnimationFrame(scrollToHeaderUnderNav));
            return;
          }
        }
        const block = headerFirstSections.includes(id) ? "start" : "center";
        el.scrollIntoView({ behavior: "smooth", block });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

function ScrollRestoration() {
  useEffect(() => {
    if (typeof window.history.scrollRestoration === "string") {
      window.history.scrollRestoration = "manual";
    }
  }, []);
  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Wait for splash darken + fade-out (~0.35s + 0.4s)
    const t = setTimeout(() => setShowSplash(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const { innerWidth, innerHeight } = window;
      if (!innerWidth || !innerHeight) return;

      const normX = event.clientX / innerWidth - 0.5;
      const normY = event.clientY / innerHeight - 0.5;

      // Very subtle parallax, opposite to cursor
      const maxShift = 10; // px; lower = gentler

      const x = (-normX * 2 * maxShift).toFixed(2);
      const y = (-normY * 2 * maxShift).toFixed(2);

      document.documentElement.style.setProperty("--bg-shift-x", `${x}px`);
      document.documentElement.style.setProperty("--bg-shift-y", `${y}px`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    if (!import.meta.env || !import.meta.env.DEV) return;

    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === "g") {
        document.documentElement.classList.toggle("debug-grid");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Router>
      <ScrollRestoration />
      <ScrollToTop />
      {showSplash && <div className="splash" aria-hidden="true" />}

      <div className={`app-root ${showSplash ? "hidden" : "visible"}`}>
        <Navbar />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home startTyping={!showSplash} />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:projectId" element={<PortfolioDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/bebop" element={<Bebop />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
