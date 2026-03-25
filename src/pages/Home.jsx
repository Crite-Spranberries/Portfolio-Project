import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ScrollDownIcon from "../assets/vectors/scrolldown-icon.svg";
import MailIcon from "../assets/vectors/mail-icon.svg";
import MonkeyImg from "../assets/img/monkey.png";
import photography_1 from "../assets/img/photography_1.jpg";
import photography_2 from "../assets/img/photography_2.jpg";
import photography_3 from "../assets/img/photography_3.jpg";
import photography_4 from "../assets/img/photography_4.jpg";
import photography_5 from "../assets/img/photography_5.jpg";
import photography_6 from "../assets/img/photography_6.png";
import photography_7 from "../assets/img/photography_7.jpg";
import photography_8 from "../assets/img/photography_8.jpg";
import ResumePDF from "../assets/personalfiles/Samuel_Chua_Assignment02-Resume.pdf";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  getCardCategoryLabels,
} from "../data/portfolio";
import PortfolioCardCategories from "../components/PortfolioCardCategories";
import "./Home.css";
import "./Portfolio.css";

const HERO_LINE_1 = "Nice to meet you.";
const HERO_LINE_2 = "I'm Sam.";
const HERO_HEADING = `${HERO_LINE_1} ${HERO_LINE_2}`;
const SHOW_PROFILE_IMAGE = false;
const RESUME_URL = ResumePDF;

const ABOUT_PHOTOS = [
  { src: photography_1, caption: "Power lines near the Chilliwack River." },
  { src: photography_2, caption: "Bridge over the Chilliwack River." },
  { src: photography_3, caption: "Hatley Castle gardens." },
  { src: photography_4, caption: "Bridge and water in B.C." },
  { src: photography_5, caption: "Mini island view." },
  { src: photography_6, caption: "Hatley Castle in the mist." },
  { src: photography_7, caption: "Wood sculpture along the Malahat." },
  { src: photography_8, caption: "Alley in Vancouver." },
];

function Home({ startTyping = true }) {
  const location = useLocation();
  const [headingText, setHeadingText] = useState("");
  const [showContentAfterTyping, setShowContentAfterTyping] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [scrollDarken, setScrollDarken] = useState(0);
  const [portfolioCategory, setPortfolioCategory] = useState("all");
  const [showAllPortfolioFilters, setShowAllPortfolioFilters] = useState(false);

  const visiblePortfolioProjects = useMemo(() => {
    const currentFilter = PORTFOLIO_CATEGORIES.find(
      (category) => category.id === portfolioCategory,
    );

    if (!currentFilter || currentFilter.type === "all") {
      return PORTFOLIO_PROJECTS;
    }

    if (currentFilter.type === "category") {
      return PORTFOLIO_PROJECTS.filter(
        (project) => project.category === currentFilter.id,
      );
    }

    if (currentFilter.type === "tag" && currentFilter.tag) {
      return PORTFOLIO_PROJECTS.filter(
        (project) =>
          Array.isArray(project.tags) &&
          project.tags.includes(currentFilter.tag),
      );
    }

    return PORTFOLIO_PROJECTS;
  }, [portfolioCategory]);

  const hasMorePortfolioFilters = PORTFOLIO_CATEGORIES.length > 3;
  const visiblePortfolioCategories = useMemo(() => {
    if (!hasMorePortfolioFilters || showAllPortfolioFilters) {
      return PORTFOLIO_CATEGORIES;
    }

    const firstThree = PORTFOLIO_CATEGORIES.slice(0, 3);
    const activeIndex = PORTFOLIO_CATEGORIES.findIndex(
      (category) => category.id === portfolioCategory,
    );

    // If the active category isn't within the first 3, swap the 3rd pill
    // with the active one so the selection stays visible.
    if (activeIndex >= 3) {
      return [firstThree[0], firstThree[1], PORTFOLIO_CATEGORIES[activeIndex]];
    }

    return firstThree;
  }, [hasMorePortfolioFilters, portfolioCategory, showAllPortfolioFilters]);

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

    setHeadingText("");
    setShowContentAfterTyping(false);

    const text = HERO_HEADING;
    const firstSentenceEnd = text.indexOf(".") + 1;
    const len = text.length;

    // Ease-out: fast at first, then slower toward the end
    const easeOut = (progress) => 0.5 + 1.6 * progress;

    let accumulatedDelay = 120;
    const timeouts = [];

    for (let i = 0; i < len; i++) {
      const char = text[i];
      let delay;

      if (i === firstSentenceEnd) {
        delay = 320;
      } else if (char === " ") {
        delay = 20;
      } else {
        const progress = i / len;
        const multiplier = Math.max(0.5, Math.min(2.1, easeOut(progress)));
        delay = (22 + Math.random() * 28) * multiplier;
      }

      accumulatedDelay += delay;
      const sliceEnd = i + 1;

      timeouts.push(
        window.setTimeout(() => {
          setHeadingText(text.slice(0, sliceEnd));
        }, accumulatedDelay),
      );
    }

    // Show paragraph + CTA shortly after typing finishes
    timeouts.push(
      window.setTimeout(
        () => setShowContentAfterTyping(true),
        accumulatedDelay + 400,
      ),
    );

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

  useEffect(() => {
    const container = document.querySelector(".about-photos");
    if (!container) return;

    const photos = Array.from(container.querySelectorAll(".about-photo"));
    if (photos.length === 0) return;

    let activeEl = null;
    let containerRect = null;
    let offsetX = 0;
    let offsetY = 0;

    const handlePointerMove = (e) => {
      if (!activeEl || !containerRect) return;

      const newLeft = e.clientX - containerRect.left - offsetX;
      const newTop = e.clientY - containerRect.top - offsetY;

      activeEl.style.left = `${newLeft}px`;
      activeEl.style.top = `${newTop}px`;
    };

    const endDrag = () => {
      activeEl = null;
      containerRect = null;
      document.removeEventListener("pointermove", handlePointerMove);
    };

    const handlePointerDown = (e) => {
      // Only left click for mouse; allow touch/pen.
      if (e.pointerType === "mouse" && e.button !== 0) return;

      const el = e.currentTarget;
      if (!(el instanceof HTMLElement)) return;

      e.preventDefault();

      activeEl = el;
      containerRect = container.getBoundingClientRect();

      const photoRect = el.getBoundingClientRect();
      offsetX = e.clientX - photoRect.left;
      offsetY = e.clientY - photoRect.top;

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", endDrag, { once: true });
      document.addEventListener("pointercancel", endDrag, { once: true });
    };

    photos.forEach((photo) => {
      photo.addEventListener("pointerdown", handlePointerDown);
    });

    return () => {
      photos.forEach((photo) => {
        photo.removeEventListener("pointerdown", handlePointerDown);
      });
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div className="home">
      <div
        className="home-scroll-overlay"
        style={{ opacity: scrollDarken }}
        aria-hidden
      />
      <section
        id="home"
        className={`hero ${showContentAfterTyping ? "hero--reveal" : ""}`}
      >
        <div
          className={`hero-content ${showContentAfterTyping ? "hero-content--reveal" : ""}`}
        >
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
                title="Github"
                aria-label="Github"
              >
                <span className="social-tooltip" role="tooltip">
                  Github
                </span>
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
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <span className="social-tooltip" role="tooltip">
                  LinkedIn
                </span>
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
                title="Email"
              >
                <span className="social-tooltip" role="tooltip">
                  Email
                </span>
                <img src={MailIcon} alt="" width={32} height={32} />
              </a>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Resume Samuel"
                title="Resume"
              >
                <span className="social-tooltip" role="tooltip">
                  Resume
                </span>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
                </svg>
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

      {/* Services section intentionally hidden for now. */}

      <section id="portfolio" className="home-section home-section--portfolio">
        <div className="home-section__content home-section__content--portfolio">
          <hr className="home-section-divider" aria-hidden />

          <section className="portfolio-shell">
            <header className="portfolio-header">
              <h2 className="portfolio-title">PORTFOLIO</h2>
            </header>
            <div
              className="portfolio-pills"
              role="tablist"
              aria-label="Filter portfolio projects by category"
            >
              {visiblePortfolioCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`portfolio-pill${
                    portfolioCategory === category.id
                      ? " portfolio-pill--active"
                      : ""
                  }`}
                  onClick={() => {
                    setPortfolioCategory(category.id);
                    setShowAllPortfolioFilters(false);
                  }}
                  role="tab"
                  aria-selected={portfolioCategory === category.id}
                >
                  {category.label}
                </button>
              ))}
              {hasMorePortfolioFilters && !showAllPortfolioFilters && (
                <button
                  type="button"
                  className="portfolio-pill portfolio-pill--more-filters"
                  onClick={() => setShowAllPortfolioFilters(true)}
                  aria-label="Show more portfolio filters"
                >
                  More Filters
                </button>
              )}
              {hasMorePortfolioFilters && showAllPortfolioFilters && (
                <button
                  type="button"
                  className="portfolio-pill portfolio-pill--more-filters"
                  onClick={() => setShowAllPortfolioFilters(false)}
                  aria-label="Show fewer portfolio filters"
                >
                  Show less
                </button>
              )}
            </div>

            <div className="portfolio-grid">
              {visiblePortfolioProjects.map((project) => {
                const kindLabel =
                  project.kind === "case-study" ? "Case study" : "Project";

                return (
                  <Link
                    key={project.id}
                    to={`/portfolio/${project.id}`}
                    className="portfolio-card-link"
                  >
                    <article className="portfolio-card">
                      <div className="portfolio-card-image-wrapper">
                        <img
                          src={project.image || MonkeyImg}
                          alt=""
                          className="portfolio-card-image"
                          loading="lazy"
                        />
                      </div>
                      <div className="portfolio-card-body">
                        <h3 className="portfolio-card-title">
                          {project.title}
                        </h3>
                        <p className="portfolio-card-kind">{kindLabel}</p>
                        <PortfolioCardCategories
                          labels={getCardCategoryLabels(project)}
                        />
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section id="about" className="home-section home-section--about">
        <div className="home-section__content home-section__content--about">
          <hr className="home-section-divider" aria-hidden />
          <div className="about-layout">
            <div className="about-photos" aria-label="Personal photography">
              {ABOUT_PHOTOS.map((photo, i) => (
                <figure
                  key={i}
                  className="about-photo"
                  style={{ "--photo-index": i }}
                >
                  <div className="about-photo__frame">
                    <img
                      src={photo.src}
                      alt=""
                      loading="lazy"
                      className="about-photo__img"
                    />
                  </div>
                  <figcaption className="about-photo__caption">
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="about-text">
              <h2 className="home-section__title">ABOUT ME</h2>
              <p className="home-section__text">
                Hi! I&apos;m a Canadian front-end developer and website designer
                based in Surrey, B.C. I like to make web experiences that
                communicate authenticity, and feel organic. When I&apos;m not
                making websites or little projects, you might find me out on a
                river walk, taking nature photos, or visiting a music bar.
                <br></br>
                <br></br>
                If you can&apos;t find me enjoying the above, I&apos;m probably
                enjoying a good nap. Otherwise, seriously speaking, I like to
                play the electric bass, print, paint, make cosplay props, and
                play the occasional video game (I&apos;m in a bit of a
                Helldivers II phase at the moment).
                <br></br>
                <br></br>
                <span className="portfolio-context__text about-me-hint">
                  These are some photos I've taken in the last few years. Try
                  moving them around!
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div
        className={`scroll-indicator ${
          showScrollIndicator ? "scroll-indicator--visible" : ""
        }`}
        aria-hidden={!showScrollIndicator}
      >
        <p>
          <span className="scroll-indicator-text scroll-indicator-text--desktop">
            Scroll down for more
          </span>
          <span className="scroll-indicator-text scroll-indicator-text--mobile">
            Swipe down for more
          </span>
        </p>
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
