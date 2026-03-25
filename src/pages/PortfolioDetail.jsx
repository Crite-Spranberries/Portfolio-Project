import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Portfolio.css";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  getCardCategoryLabels,
} from "../data/portfolio";

function formatWebsiteDestination(href) {
  try {
    const u = new URL(href);
    let out = u.host;
    if (u.pathname && u.pathname !== "/") {
      out += u.pathname.replace(/\/$/, "");
    }
    return out;
  } catch {
    return href;
  }
}

/** Montro (project) uses the same bleed + nav structure; case studies use `renderCaseStudyBody` instead. */
const MONTRO_FULL_BLEED_PROJECT_ID = "montro-app-design";

/** Section anchors for in-page nav / scroll-spy. Projects: Montro only. Case studies: `project.id` prefix. */
function getSectionAnchorId(project, segment) {
  if (project.id === MONTRO_FULL_BLEED_PROJECT_ID) return `montro-${segment}`;
  if (project.kind === "case-study") return `${project.id}-${segment}`;
  return undefined;
}

const MONTRO_PROGRESS_ITEMS = [
  { id: "montro-introduction", label: "Introduction" },
  { id: "montro-challenge", label: "Challenge" },
  { id: "montro-process", label: "Process" },
  { id: "montro-design", label: "Design" },
  { id: "montro-development", label: "Development" },
  { id: "montro-takeaways", label: "Final products" },
];

/** Viewport line from top: last section whose top is at or above this line is active (stable scroll-spy). */
const MONTRO_NAV_VIEWPORT_LINE = 0.34;
/** Ignore scroll-driven updates briefly after clicking a pill (smooth scroll crosses sections). */
const MONTRO_NAV_SCROLL_LOCK_MS = 950;

function MontroProgressNav({ sections }) {
  const navItems = sections?.length ? sections : MONTRO_PROGRESS_ITEMS;
  const idsKey = navItems.map((it) => it.id).join("|");
  const idsList = useMemo(() => navItems.map((it) => it.id), [idsKey]);

  const [activeId, setActiveId] = useState(() => idsList[0]);
  const scrollLockUntilRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    setActiveId((prev) => (idsList.includes(prev) ? prev : idsList[0]));
  }, [idsList]);

  useEffect(() => {
    const computeActiveId = () => {
      if (typeof window === "undefined") return idsList[0];
      if (Date.now() < scrollLockUntilRef.current) return null;

      const line = window.innerHeight * MONTRO_NAV_VIEWPORT_LINE;
      let current = idsList[0];
      for (const id of idsList) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= line) current = id;
      }
      return current;
    };

    const apply = () => {
      const next = computeActiveId();
      if (next == null) return;
      setActiveId((prev) => (prev === next ? prev : next));
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [idsList]);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    scrollLockUntilRef.current = Date.now() + MONTRO_NAV_SCROLL_LOCK_MS;
    const clearLock = () => {
      scrollLockUntilRef.current = 0;
    };
    const t = window.setTimeout(clearLock, MONTRO_NAV_SCROLL_LOCK_MS);
    const onScrollEnd = () => {
      window.clearTimeout(t);
      clearLock();
    };
    window.addEventListener("scrollend", onScrollEnd, { passive: true, once: true });
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <nav className="montro-progress-nav" aria-label="Case study section navigation">
      <ul className="montro-progress-nav__list">
        {navItems.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="montro-progress-nav__li">
              <button
                type="button"
                className={`montro-progress-nav__btn${
                  isActive ? " montro-progress-nav__btn--active" : ""
                }`}
                onClick={() => scrollTo(item.id)}
                aria-current={isActive ? "true" : "false"}
              >
                <span className="montro-progress-nav__label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function renderContextTextWithOptionalLink(text, linkLabel = "View Figma file") {
  if (text == null || String(text).trim() === "") return null;
  const s = String(text);
  const match = s.match(/https?:\/\/\S+/);
  if (!match) {
    return <em>{s}</em>;
  }
  const rawUrl = match[0];
  const href = rawUrl.replace(/[.,;!?]+$/, "");
  const before = s.slice(0, match.index).trim();
  const after = s.slice(match.index + rawUrl.length).trim();
  return (
    <em>
      {before}
      {before ? " " : null}
      <a
        className="portfolio-context__link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkLabel}
      </a>
      {after ? ` ${after}` : null}
    </em>
  );
}

function FinalLinkPairCard({ title, href, image }) {
  const dest = formatWebsiteDestination(href);
  return (
    <div className="portfolio-final-link-card">
      <h3 className="portfolio-detail-section__title--personas portfolio-final-link-card__title">
        {title}
      </h3>
      <a
        className="portfolio-final-link-card__link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title} — opens in a new tab`}
      >
        <span className="portfolio-final-link-card__media">
          <img
            src={image}
            alt=""
            className="portfolio-final-link-card__img"
            loading="lazy"
          />
          <span className="portfolio-final-link-card__overlay" aria-hidden="true">
            <span className="portfolio-final-link-card__overlay-text">
              <span className="portfolio-final-link-card__overlay-line">
                By clicking this image you will be directed to
              </span>
              <span className="portfolio-final-link-card__overlay-dest">{dest}</span>
            </span>
          </span>
        </span>
      </a>
    </div>
  );
}

function DesignThinkingCarousel({ images, size = "default" }) {
  const [index, setIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const pendingIndexRef = useRef(null);
  const n = images.length;
  if (!n) return null;

  const goPrev = () => {
    if (pendingIndexRef.current !== null) return;
    const next = (index - 1 + n) % n;
    if (next === index) return;
    pendingIndexRef.current = next;
    setImageOpacity(0);
  };

  const goNext = () => {
    if (pendingIndexRef.current !== null) return;
    const next = (index + 1) % n;
    if (next === index) return;
    pendingIndexRef.current = next;
    setImageOpacity(0);
  };

  const handleImageTransitionEnd = (e) => {
    if (e.propertyName !== "opacity") return;
    const pending = pendingIndexRef.current;
    if (pending === null) return;
    pendingIndexRef.current = null;
    setIndex(pending);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setImageOpacity(1));
    });
  };

  const isLarge = size === "large";
  const isPersonas = size === "personas";
  const rootClass = isLarge
    ? "portfolio-detail-carousel portfolio-detail-carousel--large"
    : isPersonas
      ? "portfolio-detail-carousel portfolio-detail-carousel--personas"
      : "portfolio-detail-carousel";
  const frameClass = isLarge
    ? "portfolio-detail-image-frame portfolio-detail-carousel__frame portfolio-detail-carousel__frame--large"
    : isPersonas
      ? "portfolio-detail-image-frame portfolio-detail-carousel__frame portfolio-detail-carousel__frame--personas"
      : "portfolio-detail-image-frame portfolio-detail-carousel__frame";

  const openLightbox = () => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const lightboxPrev = () => {
    setLightboxIndex((i) => (i - 1 + n) % n);
  };
  const lightboxNext = () => {
    setLightboxIndex((i) => (i + 1) % n);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setLightboxIndex((i) => (i - 1 + n) % n);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setLightboxIndex((i) => (i + 1) % n);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxOpen, n]);

  const lightbox =
    lightboxOpen &&
    createPortal(
      <div
        className="portfolio-carousel-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged image preview"
        onClick={closeLightbox}
      >
        {n > 1 && (
          <button
            type="button"
            className="portfolio-carousel-lightbox__nav portfolio-carousel-lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              lightboxPrev();
            }}
            aria-label={isPersonas ? "Previous persona" : "Previous image"}
          >
            {"<"}
          </button>
        )}
        <div
          className="portfolio-carousel-lightbox__content"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="portfolio-carousel-lightbox__close"
            onClick={closeLightbox}
            aria-label="Close preview"
          >
            ×
          </button>
          <img
            src={images[lightboxIndex]}
            alt=""
            className="portfolio-carousel-lightbox__img"
            loading="eager"
            decoding="async"
          />
          <div className="portfolio-carousel-lightbox__counter" aria-hidden="true">
            {lightboxIndex + 1} / {n}
          </div>
        </div>
        {n > 1 && (
          <button
            type="button"
            className="portfolio-carousel-lightbox__nav portfolio-carousel-lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              lightboxNext();
            }}
            aria-label={isPersonas ? "Next persona" : "Next image"}
          >
            {">"}
          </button>
        )}
      </div>,
      document.body,
    );

  return (
    <>
      <div className={rootClass}>
        {n > 1 && (
          <div className="portfolio-detail-carousel__nav portfolio-detail-carousel__nav--prev">
            <button
              type="button"
              className="portfolio-detail-carousel__btn portfolio-detail-carousel__btn--prev"
              onClick={goPrev}
              aria-label={isPersonas ? "Previous persona" : "Previous image"}
            >
              {"<"}
            </button>
          </div>
        )}
        <div
          className={frameClass}
          role="button"
          tabIndex={0}
          onClick={openLightbox}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openLightbox();
            }
          }}
          aria-label="View larger preview"
        >
          <img
            src={images[index]}
            alt=""
            className="portfolio-detail-image portfolio-detail-carousel__image"
            loading="lazy"
            style={{ opacity: imageOpacity }}
            onTransitionEnd={handleImageTransitionEnd}
          />
          {n > 1 && (
            <div className="portfolio-detail-carousel__counter-wrap" aria-hidden="true">
              <span className="portfolio-detail-carousel__counter">
                {index + 1}/{n}
              </span>
            </div>
          )}
        </div>
        {n > 1 && (
          <div className="portfolio-detail-carousel__nav portfolio-detail-carousel__nav--next">
            <button
              type="button"
              className="portfolio-detail-carousel__btn portfolio-detail-carousel__btn--next"
              onClick={goNext}
              aria-label={isPersonas ? "Next persona" : "Next image"}
            >
              {">"}
            </button>
          </div>
        )}
      </div>
      {lightbox}
    </>
  );
}

/**
 * Case studies (`kind: "case-study"`): dedicated layout path so sections can diverge from projects.
 * With `detail`, uses the same bleed structure as Montro for now; evolve this function for unique case study UI.
 */
function renderCaseStudyBody(project) {
  const d = project.detail;
  if (!d) {
    return (
      <>
        <section className="portfolio-detail-section portfolio-detail-section--image">
          <div className="portfolio-detail-image-frame">
            <img
              src={project.image}
              alt=""
              className="portfolio-detail-image"
              loading="lazy"
            />
          </div>
        </section>

        <section className="portfolio-detail-section">
          <p className="portfolio-detail__text">
            Add a <code>detail</code> object to this case study in{" "}
            <code>src/data/portfolio.js</code> to use the case study layout.
          </p>
        </section>
      </>
    );
  }

  return renderDetailWithBleed(project, true);
}

function renderProjectBody(project) {
  const d = project.detail;
  if (!d) {
    return (
      <p className="portfolio-detail__text">
        This is a project overview layout placeholder. Add a <code>detail</code>{" "}
        object to this project in <code>src/data/portfolio.js</code> to use the
        full layout.
      </p>
    );
  }

  return renderDetailWithBleed(project, project.id === MONTRO_FULL_BLEED_PROJECT_ID);
}

function renderDetailWithBleed(project, useFullBleedLayout) {
  const d = project.detail;
  if (!d) {
    return null;
  }

  /** When true: research lead-in bleed + optional prototype strip (Montro project + case studies). */
  const isFullCaseStudyLayout = useFullBleedLayout;

  const heroImage = d.heroImage ?? project.image;
  const designThinkingImage = d.designThinkingImage ?? project.image;
  const carouselImages = d.designThinking?.carousel ?? [designThinkingImage];
  const leadIn =
    isFullCaseStudyLayout && d.designLeadIn ? d.designLeadIn : null;
  const leadInPersonaImages =
    leadIn?.personas?.length > 0 ? leadIn.personas : null;
  const leadInUserFlowImages =
    leadIn?.userFlows?.length > 0 ? leadIn.userFlows : null;
  const leadInCarouselImages =
    leadIn?.carousel?.length > 0 ? leadIn.carousel : null;

  const prototypeFlowsImage = d.prototypeFlowsImage ?? project.image;
  const prototypeCarouselImages =
    isFullCaseStudyLayout &&
    d.prototypeFlows &&
    (d.prototypeFlows.carousel?.length
      ? d.prototypeFlows.carousel
      : [prototypeFlowsImage]);

  const beforeBleed = (
    <>
      <section className="portfolio-detail-section portfolio-detail-section--split">
        <div className="portfolio-detail-column">
          <h2 className="portfolio-detail-section__title">ROLE(S)</h2>
          <p className="portfolio-detail__text">{d.role}</p>
        </div>

        <div className="portfolio-detail-column portfolio-detail-column--right">
          <h2 className="portfolio-detail-section__title">TOOLS</h2>
          <ul className="portfolio-tools">
            {(d.tools || []).map((tool, i) => (
              <li key={i} className="portfolio-tool">
                <span className="portfolio-tool-icon" aria-hidden>
                  <span className="portfolio-tool-icon-inner">
                    {tool.short}
                  </span>
                </span>
                <span className="portfolio-tool-label">{tool.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="portfolio-detail-section portfolio-detail-section--image">
        <div className="portfolio-detail-image-frame">
          <img
            src={heroImage}
            alt=""
            className="portfolio-detail-image"
            loading="lazy"
          />
        </div>
      </section>

      <section
        className="portfolio-detail-section"
        id={getSectionAnchorId(project, "introduction")}
      >
        <h2 className="portfolio-detail-section__title">
          {d.overview?.title ?? "OVERVIEW"}
        </h2>
        <p className="portfolio-detail__text">{d.overview?.text}</p>
      </section>
    </>
  );

  const bleed = (
    <>
      {leadIn && (
        <div
          className="portfolio-detail-bleed portfolio-detail-bleed--lead-only"
        >
          <div className="portfolio-detail-bleed__inner">
            {leadInPersonaImages && leadInUserFlowImages ? (
              <div className="portfolio-detail-lead-montro">
                <section
                  className="portfolio-detail-section portfolio-detail-section--bleed-lead portfolio-detail-section--lead-research-full"
                  id={getSectionAnchorId(project, "challenge")}
                >
                  <h2 className="portfolio-detail-section__title">
                    {leadIn.title ?? "RESEARCH & INSIGHT"}
                  </h2>
                  <p className="portfolio-detail__text">{leadIn.text}</p>
                  {leadIn.contextText && (
                    <p className="portfolio-detail__text portfolio-context__text">
                      <em>{leadIn.contextText}</em>
                    </p>
                  )}
                </section>

                <hr className="portfolio-detail-subsection-divider" aria-hidden />

                <section className="portfolio-detail-section portfolio-detail-section--lead-subsection">
                  <h3 className="portfolio-detail-section__title portfolio-detail-section__title--personas">
                    {leadIn.personasTitle ?? "USER PERSONAS"}
                  </h3>
                  <div className="portfolio-detail-montro-side-by-side">
                    {leadInPersonaImages.map((src, i) => (
                      <div
                        key={`${src}-${i}`}
                        className="portfolio-detail-montro-side-by-side__item"
                      >
                        <DesignThinkingCarousel images={[src]} size="personas" />
                      </div>
                    ))}
                  </div>
                </section>

                <hr className="portfolio-detail-subsection-divider" aria-hidden />

                <section className="portfolio-detail-section portfolio-detail-section--lead-subsection">
                  <h3 className="portfolio-detail-section__title portfolio-detail-section__title--personas">
                    {leadIn.userFlowsTitle ?? "INITIAL USER FLOWS"}
                  </h3>
                  <div className="portfolio-detail-montro-side-by-side portfolio-detail-montro-side-by-side--flows">
                    {leadInUserFlowImages.map((src, i) => (
                      <div
                        key={`${src}-${i}`}
                        className="portfolio-detail-montro-side-by-side__item"
                      >
                        <DesignThinkingCarousel images={[src]} size="large" />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : leadInPersonaImages ? (
              <section
                className="portfolio-detail-section portfolio-detail-section--split portfolio-detail-section--split-centered portfolio-detail-section--bleed-lead"
                id={getSectionAnchorId(project, "challenge")}
              >
                <div className="portfolio-detail-column">
                  <h2 className="portfolio-detail-section__title">
                    {leadIn.title ?? "RESEARCH & INSIGHT"}
                  </h2>
                  <p className="portfolio-detail__text">{leadIn.text}</p>
                  {leadIn.contextText && (
                    <p className="portfolio-detail__text portfolio-context__text">
                      <em>{leadIn.contextText}</em>
                    </p>
                  )}
                </div>
                <div className="portfolio-detail-column portfolio-detail-column--image portfolio-detail-column--image-right portfolio-detail-column--lead-personas">
                  <h3 className="portfolio-detail-section__title portfolio-detail-section__title--personas">
                    {leadIn.personasTitle ?? "USER PERSONAS"}
                  </h3>
                  <DesignThinkingCarousel
                    images={leadInPersonaImages}
                    size="personas"
                  />
                </div>
              </section>
            ) : leadInCarouselImages ? (
              <section
                className="portfolio-detail-section portfolio-detail-section--split portfolio-detail-section--split-centered portfolio-detail-section--bleed-lead"
                id={getSectionAnchorId(project, "challenge")}
              >
                <div className="portfolio-detail-column">
                  <h2 className="portfolio-detail-section__title">
                    {leadIn.title ?? "RESEARCH & INSIGHT"}
                  </h2>
                  <p className="portfolio-detail__text">{leadIn.text}</p>
                  {leadIn.contextText && (
                    <p className="portfolio-detail__text portfolio-context__text">
                      <em>{leadIn.contextText}</em>
                    </p>
                  )}
                </div>
                <div className="portfolio-detail-column portfolio-detail-column--image portfolio-detail-column--image-right">
                  <DesignThinkingCarousel images={leadInCarouselImages} />
                </div>
              </section>
            ) : (
              <section
                className="portfolio-detail-section portfolio-detail-section--bleed-lead portfolio-detail-section--bleed-lead-text-only"
                id={getSectionAnchorId(project, "challenge")}
              >
                <h2 className="portfolio-detail-section__title">
                  {leadIn.title ?? "RESEARCH & INSIGHT"}
                </h2>
                <p className="portfolio-detail__text">{leadIn.text}</p>
                {leadIn.contextText && (
                  <p className="portfolio-detail__text portfolio-context__text">
                    <em>{leadIn.contextText}</em>
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      )}
      {isFullCaseStudyLayout && d.prototypeFlows && prototypeCarouselImages && (
        <div className="portfolio-detail__inner portfolio-detail__inner--prototype-flows">
          <div className="portfolio-detail__body">
            <section
              className="portfolio-detail-section portfolio-detail-section--prototype-flows"
              id={getSectionAnchorId(project, "process")}
            >
              <h2 className="portfolio-detail-section__title">
                {d.prototypeFlows.title ?? "FIGMA PROTOTYPE"}
              </h2>
              <p className="portfolio-detail__text">{d.prototypeFlows.text}</p>
              {d.prototypeFlows.contextText && (
                <p className="portfolio-detail__text portfolio-context__text">
                  {renderContextTextWithOptionalLink(
                    d.prototypeFlows.contextText,
                    "Open Figma file"
                  )}
                </p>
              )}
              <div className="portfolio-detail-section__prototype-carousel">
                <DesignThinkingCarousel
                  images={prototypeCarouselImages}
                  size="large"
                />
              </div>
            </section>
          </div>
        </div>
      )}
      <div
        className={`portfolio-detail-bleed portfolio-detail-bleed--design-thinking${
          isFullCaseStudyLayout && d.prototypeFlows
            ? " portfolio-detail-bleed--after-prototype"
            : ""
        }`}
      >
        <div className="portfolio-detail-bleed__inner">
          <section
            className="portfolio-detail-section portfolio-detail-section--split portfolio-detail-section--split-centered"
            id={getSectionAnchorId(project, "design")}
          >
            <div className="portfolio-detail-column portfolio-detail-column--image">
              <DesignThinkingCarousel images={carouselImages} />
            </div>

            <div className="portfolio-detail-column">
              <h2 className="portfolio-detail-section__title">DESIGN THINKING</h2>
              <p className="portfolio-detail__text">{d.designThinking?.text}</p>
              {d.designThinking?.contextText && (
                <p className="portfolio-detail__text portfolio-context__text">
                  <em>{d.designThinking.contextText}</em>
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );

  const afterBleed = (
    <>
      <section
        className="portfolio-detail-section"
        id={getSectionAnchorId(project, "development")}
      >
        <h2 className="portfolio-detail-section__title">
          {d.conceptRationale?.title ?? "CONCEPT & RATIONALE"}
        </h2>
        <p className="portfolio-detail__text portfolio-detail__text--preline">
          {d.conceptRationale?.text}
        </p>
      </section>

      <section
        className="portfolio-detail-section portfolio-detail-section--final"
        id={getSectionAnchorId(project, "takeaways")}
      >
        {project.id === "can-product-design" && Array.isArray(d.finalResult?.dielines) ? (
          <div className="portfolio-final-frame portfolio-final-frame--dielines">
            <h1 className="portfolio-detail__title portfolio-final-frame__header">
              {d.finalResult?.title ?? "FINAL PRODUCTS"}
            </h1>
            {d.finalResult.dielines.map((src, idx) => (
              <div key={src || idx} className="portfolio-final-frame__dieline">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        ) : Array.isArray(d.finalResult?.posters) ? (
          <div className="portfolio-final-frame portfolio-final-frame--dielines">
            <h1 className="portfolio-detail__title portfolio-final-frame__header">
              {d.finalResult?.title ?? "FINAL PRODUCTS"}
            </h1>
            {d.finalResult.posters.map((src, idx) => (
              <div
                key={src || idx}
                className="portfolio-final-frame__poster-preview"
              >
                <img src={src} alt={`Poster preview ${idx + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        ) : d.finalResult?.video ? (
          d.finalResult.linkPair?.left?.href &&
          d.finalResult.linkPair?.right?.href &&
          d.finalResult.linkPair.left.image &&
          d.finalResult.linkPair.right.image ? (
            <div className="portfolio-final-frame portfolio-final-frame--composite">
              <h1 className="portfolio-detail__title portfolio-final-frame__header">
                {d.finalResult?.title ?? "FINAL PRODUCTS"}
              </h1>
              <div className="portfolio-final-link-pair-row">
                <FinalLinkPairCard
                  title={d.finalResult.linkPair.left.title}
                  href={d.finalResult.linkPair.left.href}
                  image={d.finalResult.linkPair.left.image}
                />
                <FinalLinkPairCard
                  title={d.finalResult.linkPair.right.title}
                  href={d.finalResult.linkPair.right.href}
                  image={d.finalResult.linkPair.right.image}
                />
              </div>
              <div className="portfolio-final-video-stack">
                <h3
                  className="portfolio-detail-section__title--personas portfolio-final-video-stack__title"
                >
                  {d.finalResult.videoTitle ?? "PROMO VIDEO"}
                </h3>
                <video
                  className="portfolio-final-video"
                  src={d.finalResult.video}
                  controls
                  preload="metadata"
                />
              </div>
            </div>
          ) : (
            <div className="portfolio-final-frame portfolio-final-frame--video">
              <h1 className="portfolio-detail__title portfolio-final-frame__header">
                {d.finalResult?.title ?? "FINAL PRODUCT"}
              </h1>
              <video
                className="portfolio-final-video"
                src={d.finalResult.video}
                controls
                preload="metadata"
              />
            </div>
          )
        ) : (
          <div className="portfolio-final-frame portfolio-final-frame--button">
            <h1 className="portfolio-detail__title portfolio-final-frame__header">
              {d.finalResult?.title ?? "FINAL PRODUCT"}
            </h1>
            {d.finalResult?.buttonText && (
              <button type="button" className="portfolio-final-frame__button">
                {d.finalResult.buttonText}
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );

  return { beforeBleed, bleed, afterBleed };
}

function PortfolioDetail() {
  const { projectId } = useParams();

  const project = useMemo(
    () => PORTFOLIO_PROJECTS.find((item) => item.id === projectId),
    [projectId],
  );

  if (!project) {
    return (
      <div className="portfolio-detail">
        <div className="portfolio-detail__inner">
          <h1 className="portfolio-detail__title">Project not found</h1>
          <p className="portfolio-detail__text">
            The project you are looking for does not exist or has moved.
          </p>
          <Link to="/#portfolio" className="portfolio-detail__back-link">
            Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const isCaseStudy = project.kind === "case-study";
  const body = isCaseStudy
    ? renderCaseStudyBody(project)
    : renderProjectBody(project);
  const hasSplit =
    body && typeof body === "object" && "bleed" in body && "beforeBleed" in body;
  const hasBleed = !!project.detail;

  useEffect(() => {
    if (!hasBleed) return;
    document.body.classList.add("portfolio-detail-page");
    return () => document.body.classList.remove("portfolio-detail-page");
  }, [hasBleed]);

  const caseStudyProgressSections = useMemo(() => {
    if (!project.detail) return null;
    if (project.kind !== "case-study" && project.id !== MONTRO_FULL_BLEED_PROJECT_ID) {
      return null;
    }
    const d = project.detail;

    const sections = [
      {
        id: getSectionAnchorId(project, "introduction"),
        label: d.overview?.title ?? "OVERVIEW",
      },
      {
        id: getSectionAnchorId(project, "challenge"),
        label: d.designLeadIn?.title ?? "RESEARCH & INSIGHT",
      },
    ];

    if (d.prototypeFlows) {
      sections.push({
        id: getSectionAnchorId(project, "process"),
        label: d.prototypeFlows.title ?? "FIGMA PROTOTYPE",
      });
    }

    sections.push(
      { id: getSectionAnchorId(project, "design"), label: "DESIGN THINKING" },
      {
        id: getSectionAnchorId(project, "development"),
        label: d.conceptRationale?.title ?? "CONCEPT & RATIONALE",
      },
      {
        id: getSectionAnchorId(project, "takeaways"),
        label: d.finalResult?.title ?? "FINAL PRODUCTS",
      },
    );

    return sections;
  }, [
    project.id,
    project.kind,
    project.detail,
    project.detail?.overview?.title,
    project.detail?.designLeadIn?.title,
    project.detail?.prototypeFlows,
    project.detail?.prototypeFlows?.title,
    project.detail?.conceptRationale?.title,
    project.detail?.finalResult?.title,
  ]);

  return (
    <div
      className={`portfolio-detail ${
        isCaseStudy
          ? "portfolio-detail--case-study"
          : "portfolio-detail--standard"
      }`}
      data-portfolio-detail-kind={isCaseStudy ? "case-study" : "project"}
    >
      {caseStudyProgressSections && (
        <MontroProgressNav sections={caseStudyProgressSections} />
      )}
      <div className="portfolio-detail__inner">
        <header className="portfolio-detail__header">
          <p className="portfolio-detail__eyebrow">
            {isCaseStudy ? "CASE STUDY" : "PROJECT"}
          </p>
          <h1 className="portfolio-detail__title">{project.title}</h1>
          {(() => {
            const labels = getCardCategoryLabels(project);
            if (!labels.length) return null;
            return (
              <ul className="portfolio-tags">
                {labels.map((tag) => (
                  <li key={tag} className="portfolio-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            );
          })()}
        </header>

        <div className="portfolio-detail__body">
          {hasSplit ? body.beforeBleed : body}
        </div>

        {!hasSplit && (
          <footer className="portfolio-detail__footer">
            <Link to="/#portfolio" className="portfolio-detail__back-link">
              Back to portfolio
            </Link>
          </footer>
        )}
      </div>

      {hasSplit && body.bleed}

      {hasSplit && (
        <div className="portfolio-detail__inner">
          <div className="portfolio-detail__body">{body.afterBleed}</div>
          <footer className="portfolio-detail__footer">
            <Link to="/#portfolio" className="portfolio-detail__back-link">
              Back to portfolio
            </Link>
          </footer>
        </div>
      )}
    </div>
  );
}

export default PortfolioDetail;
