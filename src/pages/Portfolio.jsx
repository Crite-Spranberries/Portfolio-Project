import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Portfolio.css";
import PlaceholderImage from "../assets/img/monkey.png";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  getCardCategoryLabels,
} from "../data/portfolio";
import PortfolioCardCategories from "../components/PortfolioCardCategories";

function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = useMemo(() => {
    const currentFilter = PORTFOLIO_CATEGORIES.find(
      (category) => category.id === activeCategory,
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
  }, [activeCategory]);

  return (
    <div className="portfolio-page">
      <section className="portfolio-shell">
        <header className="portfolio-header">
          <h1 className="portfolio-title">Portfolio</h1>
        </header>

        <div
          className="portfolio-pills"
          role="tablist"
          aria-label="Filter portfolio projects by category"
        >
          {PORTFOLIO_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`portfolio-pill${
                activeCategory === category.id ? " portfolio-pill--active" : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
              role="tab"
              aria-selected={activeCategory === category.id}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredProjects.map((project) => {
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
                      src={PlaceholderImage}
                      alt=""
                      className="portfolio-card-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="portfolio-card-body">
                    <h2 className="portfolio-card-title">{project.title}</h2>
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
  );
}

export default Portfolio;
