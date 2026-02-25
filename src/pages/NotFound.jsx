import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  useEffect(() => {
    document.title = "404 - Not Found | Samuel Chua";
    return () => {
      document.title = "Samuel Chua";
    };
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
