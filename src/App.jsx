import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
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
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Wait for splash darken + fade-out (~0.35s + 0.4s)
    const t = setTimeout(() => setShowSplash(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {showSplash && <div className="splash" aria-hidden="true" />}

      <div className={`app-root ${showSplash ? "hidden" : "visible"}`}>
        <Navbar />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home startTyping={!showSplash} />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
