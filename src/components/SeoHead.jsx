import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyPersonJsonLd, applySeo } from "../seo/applySeo";
import { DEFAULT_DESCRIPTION } from "../seo/siteConfig";

/**
 * Client-side SEO for static routes. Portfolio detail pages set their own meta in
 * `PortfolioDetail`; 404 sets meta in `NotFound`.
 */
export default function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.replace(/\/$/, "") || "/";

    if (path.startsWith("/portfolio/") && path !== "/portfolio") {
      return undefined;
    }

    let cleanupJsonLd;

    if (path === "/") {
      applySeo({
        title: "Samuel Chua | Front-end Developer & Designer | Surrey, BC",
        description: DEFAULT_DESCRIPTION,
        pathname: "/",
      });
      cleanupJsonLd = applyPersonJsonLd();
    } else if (path === "/portfolio") {
      applySeo({
        title: "Portfolio",
        description:
          "Selected web, UI/UX, graphic, and motion design projects by Samuel Chua — front-end developer and designer in Surrey, B.C.",
        pathname: "/portfolio",
      });
    } else if (path === "/about") {
      applySeo({
        title: "About",
        description:
          "About Samuel Chua — front-end developer and website designer based in Surrey, British Columbia.",
        pathname: "/about",
      });
    } else if (path === "/contact") {
      applySeo({
        title: "Contact",
        description:
          "Get in touch with Samuel Chua for web development, UI/UX, and design projects in the Lower Mainland and beyond.",
        pathname: "/contact",
      });
    } else if (path === "/landing") {
      applySeo({
        title: "Landing",
        description:
          "Samuel Chua — front-end development, design, and contact. Surrey, B.C.",
        pathname: "/landing",
      });
    }

    return () => {
      cleanupJsonLd?.();
    };
  }, [pathname]);

  return null;
}
