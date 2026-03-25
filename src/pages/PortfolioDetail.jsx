import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Portfolio.css";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  getCardCategoryLabels,
} from "../data/portfolio";

function DesignThinkingCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const [imageOpacity, setImageOpacity] = useState(1);
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

  return (
    <div className="portfolio-detail-carousel">
      <div className="portfolio-detail-image-frame portfolio-detail-carousel__frame">
        <img
          src={images[index]}
          alt=""
          className="portfolio-detail-image portfolio-detail-carousel__image"
          loading="lazy"
          style={{ opacity: imageOpacity }}
          onTransitionEnd={handleImageTransitionEnd}
        />
        <div className="portfolio-detail-carousel__counter-wrap" aria-hidden="true">
          <span className="portfolio-detail-carousel__counter">
            {index + 1}/{n}
          </span>
        </div>
      </div>
      <div className="portfolio-detail-carousel__controls">
        <button
          type="button"
          className="portfolio-detail-carousel__btn portfolio-detail-carousel__btn--prev"
          onClick={goPrev}
          aria-label="Previous image"
        >
          {"<"}
        </button>
        <button
          type="button"
          className="portfolio-detail-carousel__btn portfolio-detail-carousel__btn--next"
          onClick={goNext}
          aria-label="Next image"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

function renderCaseStudyBody(project) {
  switch (project.id) {
    default:
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
              This is a case study layout placeholder. Detailed walkthrough
              coming soon.
            </p>
          </section>
        </>
      );
  }
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

  const heroImage = d.heroImage ?? project.image;
  const designThinkingImage = d.designThinkingImage ?? project.image;
  const carouselImages = d.designThinking?.carousel ?? [designThinkingImage];

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

      <section className="portfolio-detail-section">
        <h2 className="portfolio-detail-section__title">
          {d.overview?.title ?? "OVERVIEW"}
        </h2>
        <p className="portfolio-detail__text">{d.overview?.text}</p>
      </section>
    </>
  );

  const bleed = (
    <div className="portfolio-detail-bleed">
      <div className="portfolio-detail-bleed__inner">
        <section className="portfolio-detail-section portfolio-detail-section--split portfolio-detail-section--split-centered">
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
  );

  const afterBleed = (
    <>
      <section className="portfolio-detail-section">
        <h2 className="portfolio-detail-section__title">
          {d.conceptRationale?.title ?? "CONCEPT & RATIONALE"}
        </h2>
        <p className="portfolio-detail__text">{d.conceptRationale?.text}</p>
      </section>

      <section className="portfolio-detail-section portfolio-detail-section--final">
        {project.id === "can-product-design" && Array.isArray(d.finalResult?.dielines) ? (
          <div className="portfolio-final-frame portfolio-final-frame--dielines">
            <h1 className="portfolio-detail__title portfolio-final-frame__header">
              {d.finalResult?.title ?? "FINAL RESULT"}
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
              {d.finalResult?.title ?? "FINAL RESULT"}
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
          <div className="portfolio-final-frame portfolio-final-frame--video">
            <h1 className="portfolio-detail__title portfolio-final-frame__header">
              {d.finalResult?.title ?? "FINAL RESULT"}
            </h1>
            <video
              className="portfolio-final-video"
              src={d.finalResult.video}
              controls
              preload="metadata"
            />
          </div>
        ) : (
          <div className="portfolio-final-frame portfolio-final-frame--button">
            <h1 className="portfolio-detail__title portfolio-final-frame__header">
              {d.finalResult?.title ?? "FINAL RESULT"}
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
  const body = project.detail
    ? renderProjectBody(project)
    : isCaseStudy
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

  return (
    <div
      className={`portfolio-detail ${
        isCaseStudy
          ? "portfolio-detail--case-study"
          : "portfolio-detail--standard"
      }`}
    >
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
