import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Portfolio.css";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  getCardCategoryLabels,
} from "../data/portfolio";

function DesignThinkingCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const n = images.length;
  if (!n) return null;

  const goPrev = () => setIndex((i) => (i - 1 + n) % n);
  const goNext = () => setIndex((i) => (i + 1) % n);

  return (
    <div className="portfolio-detail-carousel">
      <div className="portfolio-detail-image-frame portfolio-detail-carousel__frame">
        <img
          src={images[index]}
          alt=""
          className="portfolio-detail-image"
          loading="lazy"
        />
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
          <h2 className="portfolio-detail-section__title">Role(s)</h2>
          <p className="portfolio-detail__text">{d.role}</p>
        </div>

        <div className="portfolio-detail-column portfolio-detail-column--right">
          <h2 className="portfolio-detail-section__title">Tools</h2>
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
          {d.overview?.title ?? "Overview"}
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
            <h2 className="portfolio-detail-section__title">Design Thinking</h2>
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
          {d.conceptRationale?.title ?? "Concept & Rationale"}
        </h2>
        <p className="portfolio-detail__text">{d.conceptRationale?.text}</p>
      </section>

      <section className="portfolio-detail-section portfolio-detail-section--final">
        <h2 className="portfolio-detail-section__title portfolio-detail-section__title--center">
          {d.finalResult?.title ?? "Final Result"}
        </h2>
        {project.id === "can-product-design" && Array.isArray(d.finalResult?.dielines) ? (
          <div className="portfolio-final-frame portfolio-final-frame--dielines">
            {d.finalResult.dielines.map((src, idx) => (
              <div key={src || idx} className="portfolio-final-frame__dieline">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        ) : project.id === "rockies-motion-graphic" && d.finalResult?.video ? (
          <div className="portfolio-final-frame portfolio-final-frame--video">
            <video
              className="portfolio-final-video"
              src={d.finalResult.video}
              controls
              preload="metadata"
            />
          </div>
        ) : (
          <div className="portfolio-final-frame">
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
            {isCaseStudy ? "Case study" : "Project"}
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
