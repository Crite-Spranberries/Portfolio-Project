import { useEffect } from "react";
import { Link } from "react-router-dom";
import { applySeo } from "../seo/applySeo";
import "./NotFound.css";

function NotFound() {
  useEffect(() => {
    applySeo({
      title: "404 — Page not found",
      description:
        "This page is not part of Samuel Chua’s portfolio. Return home or browse projects.",
      noIndex: true,
    });
  }, []);

  return (
    <div className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__text">
        This page doesn’t exist. Whatcha lookin' for pal?
      </p>
      <Link to="/" className="not-found__link">
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
