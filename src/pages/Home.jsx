import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ScrollDownIcon from "../assets/vectors/scrolldown-icon.svg";
import MailIcon from "../assets/vectors/mail-icon.svg";
import MonkeyImg from "../assets/img/monkey.png";
import "./Home.css";

const HERO_LINE_1 = "Nice to meet you.";
const HERO_LINE_2 = "I'm Sam.";
const HERO_HEADING = `${HERO_LINE_1} ${HERO_LINE_2}`;
const SHOW_PROFILE_IMAGE = false;

function Home({ startTyping = true }) {
  const location = useLocation();
  const [headingText, setHeadingText] = useState("");
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [scrollDarken, setScrollDarken] = useState(0);

  useEffect(() => {
    if (!location.hash || location.hash === "#") {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!startTyping) {
      return;
    }

    // Reset text when we begin a new typing sequence
    setHeadingText("");

    const text = HERO_HEADING;
    const firstSentenceEnd = text.indexOf(".") + 1;

    let accumulatedDelay = 160;
    const timeouts = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      let delay;

      if (i === firstSentenceEnd) {
        // Slight pause before the "I'm Samuel." part
        delay = 420;
      } else if (char === " ") {
        // Very quick skip over spaces
        delay = 26;
      } else {
        // Vary timings slightly to feel more human
        delay = 40 + Math.random() * 40;
      }

      accumulatedDelay += delay;
      const sliceEnd = i + 1;

      timeouts.push(
        window.setTimeout(() => {
          setHeadingText(text.slice(0, sliceEnd));
        }, accumulatedDelay),
      );
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [startTyping]);

  useEffect(() => {
    if (!startTyping) {
      return;
    }

    let idleTimeout;

    const isAtBottom = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = 8; // px tolerance
      return scrollPosition >= document.body.offsetHeight - threshold;
    };

    const resetIdleTimer = () => {
      // If we're already at the bottom, never show the indicator
      if (isAtBottom()) {
        setShowScrollIndicator(false);
        if (idleTimeout) {
          window.clearTimeout(idleTimeout);
        }
        return;
      }

      setShowScrollIndicator(false);
      if (idleTimeout) {
        window.clearTimeout(idleTimeout);
      }
      idleTimeout = window.setTimeout(() => {
        // Only show if user is still not at the bottom
        if (!isAtBottom()) {
          setShowScrollIndicator(true);
        }
      }, 8000);
    };

    const handleScroll = () => {
      resetIdleTimer();
    };

    resetIdleTimer();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimeout) {
        window.clearTimeout(idleTimeout);
      }
    };
  }, [startTyping]);

  useEffect(() => {
    const handleScroll = () => {
      const services = document.getElementById("services");
      if (!services) return;
      const rect = services.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const servicesTop = rect.top;
      const progress = Math.max(
        0,
        Math.min(1, 1 - servicesTop / (viewportHeight * 0.8)),
      );
      setScrollDarken(progress * 0.6);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home">
      <div
        className="home-scroll-overlay"
        style={{ opacity: scrollDarken }}
        aria-hidden
      />
      <section id="home" className="hero">
        <div className="hero-content">
          <h1
            className="hero-heading"
            aria-label="Nice to meet you. I'm Samuel."
          >
            <span className="hero-heading-text">{headingText}</span>
          </h1>
          <p>
            A front-end developer and website designer based in Surrey, B.C. My
            interests and specialties are in creating responsive and dynamic web
            content that reflects their business missions and goals the best—
            whether it's through a mobile screen or through your desktop
            browser.
          </p>
          <div className="hero-cta">
            <div className="social-links">
              <a
                href="https://github.com/Crite-Spranberries"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/samuel-b-chua/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
              <a
                href="mailto:s22bchua@gmail.com"
                className="social-icon"
                aria-label="Email Samuel"
              >
                <img src={MailIcon} alt="" width={32} height={32} />
              </a>
            </div>
            <Link to="/#portfolio" className="cta-button">
              Recent Projects
            </Link>
          </div>
        </div>
        {SHOW_PROFILE_IMAGE && (
          <div className="hero-image">
            <img
              src="/src/assets/img/placeholder.jpg"
              alt="Samuel's Profile"
              className="profile-image"
            />
          </div>
        )}
      </section>

      <section id="services" className="home-section home-section--services">
        <div className="home-section__content">
          <hr className="home-section-divider" aria-hidden />
          <h2 className="home-section__title">Services</h2>
          <p className="home-section__text">
            My code monkey is constructing the "Services" section.. Stay tuned!
          </p>
          <img
            src={MonkeyImg}
            alt=""
            className="home-section-monkey"
            aria-hidden
          />
        </div>
      </section>

      <section id="portfolio" className="home-section home-section--portfolio">
        <div className="home-section__content">
          <hr className="home-section-divider" aria-hidden />
          <h2 className="home-section__title">Portfolio</h2>
          <p className="home-section__text">
            My code monkey is constructing the "Portfolio" section.. Stay tuned!
          </p>
          <img
            src={MonkeyImg}
            alt=""
            className="home-section-monkey"
            aria-hidden
          />
        </div>
      </section>

      <section id="about" className="home-section home-section--about">
        <div className="home-section__content">
          <hr className="home-section-divider" aria-hidden />
          <h2 className="home-section__title">About</h2>
          <p className="home-section__text">
            My code monkey is constructing the "About" section.. Stay tuned!
          </p>
          <img
            src={MonkeyImg}
            alt=""
            className="home-section-monkey"
            aria-hidden
          />
        </div>
      </section>

      <div
        className={`scroll-indicator ${
          showScrollIndicator ? "scroll-indicator--visible" : ""
        }`}
        aria-hidden={!showScrollIndicator}
      >
        <p>Scroll down for more</p>
        <img
          src={ScrollDownIcon}
          alt="Scroll down arrow"
          className="scroll-indicator-icon"
        />
      </div>
    </div>
  );
}

export default Home;
