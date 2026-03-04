import { useLayoutEffect, useRef, useState } from "react";

const CLIP_TOLERANCE = 2;

/**
 * Shows first 2 category pills when both fit; if the 2nd pill would clip
 * the card edge (e.g. "Full Stack Development"), only the 1st is shown and
 * the rest go to "+N More".
 */
function PortfolioCardCategories({ labels }) {
  const wrapRef = useRef(null);
  const [hideSecondPill, setHideSecondPill] = useState(null);

  useLayoutEffect(() => {
    if (!labels?.length || labels.length < 2) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const check = () => {
      const wrapRect = wrap.getBoundingClientRect();
      if (wrapRect.width < 10) return;
      const tags = wrap.querySelectorAll(".portfolio-card-tag");
      if (tags.length < 2) return;
      const secondRect = tags[1].getBoundingClientRect();
      const clips = secondRect.right > wrapRect.right + CLIP_TOLERANCE;
      setHideSecondPill((prev) => (prev === clips ? prev : clips));
    };

    check();
    const raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, [labels]);

  if (!labels?.length) return null;

  const showTwo = labels.length >= 2 && hideSecondPill !== true;
  const displayLabels = labels.slice(0, showTwo ? 2 : 1);
  const moreCount = labels.length - displayLabels.length;

  return (
    <div className="portfolio-card-categories-container">
      <div ref={wrapRef} className="portfolio-card-categories-wrap">
        <div className="portfolio-card-categories">
          {displayLabels.map((label) => (
            <span key={label} className="portfolio-card-tag">
              {label}
            </span>
          ))}
        </div>
      </div>
      {moreCount > 0 && (
        <span className="portfolio-card-categories-more" aria-hidden>
          +{moreCount} More
        </span>
      )}
    </div>
  );
}

export default PortfolioCardCategories;
