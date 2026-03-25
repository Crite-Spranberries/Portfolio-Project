import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Portfolio.css";
import PlaceholderImage from "../assets/img/monkey.png";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_PROJECTS,
  filterPortfolioProjectsBySelectedIds,
  getCardCategoryLabels,
} from "../data/portfolio";
import PortfolioCardCategories from "../components/PortfolioCardCategories";

function Portfolio() {
  const [selectedPortfolioFilterIds, setSelectedPortfolioFilterIds] = useState(
    [],
  );
  const [showAllPortfolioFilters, setShowAllPortfolioFilters] = useState(false);

  const filteredProjects = useMemo(
    () =>
      filterPortfolioProjectsBySelectedIds(
        PORTFOLIO_PROJECTS,
        selectedPortfolioFilterIds,
      ),
    [selectedPortfolioFilterIds],
  );

  const hasMorePortfolioFilters = PORTFOLIO_CATEGORIES.length > 3;
  const visiblePortfolioCategories = useMemo(() => {
    if (!hasMorePortfolioFilters || showAllPortfolioFilters) {
      return PORTFOLIO_CATEGORIES;
    }

    const firstThree = PORTFOLIO_CATEGORIES.slice(0, 3);
    const outsideIndices = selectedPortfolioFilterIds
      .map((id) => PORTFOLIO_CATEGORIES.findIndex((c) => c.id === id))
      .filter((i) => i >= 3);

    if (outsideIndices.length > 0) {
      const firstOutside = Math.min(...outsideIndices);
      return [firstThree[0], firstThree[1], PORTFOLIO_CATEGORIES[firstOutside]];
    }

    return firstThree;
  }, [
    hasMorePortfolioFilters,
    selectedPortfolioFilterIds,
    showAllPortfolioFilters,
  ]);

  return (
    <div className="portfolio-page">
      <section className="portfolio-shell">
        <header className="portfolio-header">
          <h1 className="portfolio-title">Portfolio</h1>
        </header>

        <div
          className="portfolio-pills"
          role="group"
          aria-label="Filter portfolio projects by category (multiple selection)"
        >
          {visiblePortfolioCategories.map((category) => {
            const isAll = category.id === "all";
            const isActive = isAll
              ? selectedPortfolioFilterIds.length === 0
              : selectedPortfolioFilterIds.includes(category.id);
            return (
              <button
                key={category.id}
                type="button"
                className={`portfolio-pill${
                  isActive ? " portfolio-pill--active" : ""
                }`}
                onClick={() => {
                  if (isAll) {
                    setSelectedPortfolioFilterIds([]);
                  } else {
                    setSelectedPortfolioFilterIds((prev) =>
                      prev.includes(category.id)
                        ? prev.filter((id) => id !== category.id)
                        : [...prev, category.id],
                    );
                  }
                  setShowAllPortfolioFilters(false);
                }}
                aria-pressed={isActive}
              >
                {category.label}
              </button>
            );
          })}
          {hasMorePortfolioFilters && !showAllPortfolioFilters && (
            <button
              type="button"
              className="portfolio-pill portfolio-pill--more-filters"
              onClick={() => setShowAllPortfolioFilters(true)}
              aria-label="Show more portfolio filters"
            >
              More filters
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
          {filteredProjects.length === 0 &&
          selectedPortfolioFilterIds.length > 0 ? (
            <p className="portfolio-empty-filters" role="status">
              Unable to find a project with these filters!
            </p>
          ) : (
            filteredProjects.map((project) => {
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
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
