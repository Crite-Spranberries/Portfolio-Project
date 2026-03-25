import MonkeyImg from "../assets/img/monkey.png";
import PlaceholderImg from "../assets/img/placeholder.jpg";
import GingerDieline from "../assets/img/Ginger Juice Variant@2x.png";
import PickleDieline from "../assets/img/Pickle Juice Variant@2x.png";
import TomatoDieline from "../assets/img/Tomato Juice Variant@2x.png";
import AdPoster1 from "../assets/img/Ad 1.png";
import AdPoster2 from "../assets/img/Ad 2.png";
import AdPoster3 from "../assets/img/Ad 3.png";
import PosterDetail1 from "../assets/img/poster_detail1.png";
import PosterDetail2 from "../assets/img/poster_detail2.png";
import PosterDetail3 from "../assets/img/poster_detail3.png";
import RockiesVideo from "../assets/videos/Final Project 2295.mov";
import MontroPromoVideo from "../assets/videos/Montro_Promo_Med.mp4";
import PosterMockup1 from "../assets/img/poster_mockup1.png";

export const PORTFOLIO_CATEGORIES = [
  { id: "all", label: "All", type: "all" },
  { id: "web", label: "Web Devt.", type: "category" },
  { id: "uiux", label: "UI/UX Design", type: "category" },
  {
    id: "graphic",
    label: "Graphic Design",
    type: "tag",
    tag: "Graphic Design",
  },
  {
    id: "product-design",
    label: "Product Design",
    type: "tag",
    tag: "Product Design",
  },
  {
    id: "motion-graphics",
    label: "Motion Graphics",
    type: "tag",
    tag: "Motion Graphics",
  },
];

/** Order for displaying category pills on cards (first in list appears first). */
export const PILL_DISPLAY_ORDER = [
  "App Design",
  "UI/UX Design",
  "Web Devt.",
  "Graphic Design",
  "Product Design",
  "Motion Graphics",
  "Full Stack Development",
  "Packaging",
  "Branding",
  "Illustration",
];

export function sortLabelsByOrder(labels) {
  const order = PILL_DISPLAY_ORDER;
  return [...labels].sort(
    (a, b) =>
      (order.indexOf(a) === -1 ? 999 : order.indexOf(a)) -
      (order.indexOf(b) === -1 ? 999 : order.indexOf(b)),
  );
}

export function getCardCategoryLabels(project) {
  const categoryLabel = PORTFOLIO_CATEGORIES.find(
    (c) => c.id === project.category,
  )?.label;
  const raw = [
    categoryLabel,
    ...(Array.isArray(project.tags) ? project.tags : []),
  ]
    .filter(Boolean)
    .filter((l, i, a) => a.indexOf(l) === i);
  return sortLabelsByOrder(raw);
}

/**
 * Project detail page content (editable). All projects with `detail` use the
 * same layout; edit these fields to change copy, headers, images, and final result.
 *
 * - role: string
 * - tools: Array<{ short: string, label: string }>  (short = icon label e.g. "Ai")
 * - overview: { title: string, text: string }
 * - designThinking: {
 *     text: string,
 *     contextText?: string,
 *     carousel?: string[] // optional: image sequence for Design Thinking carousel
 *   }
 *   Optional: heroImage, designThinkingImage (override project.image for that section)
 * - conceptRationale: { title: string, text: string }
 * - finalResult: { title?: string, buttonText?: string }
 */
export const PORTFOLIO_PROJECTS = [
  {
    id: "safespace-case-study",
    title: "SAFESPACE APP",
    category: "uiux",
    kind: "case-study",
    tags: ["Full Stack Development", "UI/UX Design", "App Design"],
    image: PlaceholderImg,
    detail: {
      role: "Lead Full Stack Developer",
      tools: [],
      overview: {
        title: "OVERVIEW",
        text: "...",
      },
      designThinking: {
        text: "...",
        contextText: "...",
        carousel: [PlaceholderImg],
      },
      conceptRationale: {
        title: "CONCEPT & RATIONALE",
        text: "..." + "...",
      },
      finalResult: {
        title: "FINAL RESULT",
        buttonText: "View prototype",
      },
    },
  },
  {
    id: "can-product-design",
    title: "CAN PRODUCT DESIGN",
    category: "graphic",
    kind: "project",
    tags: [
      "Graphic Design",
      "Product Design",
      "Packaging",
      "Branding",
      "Illustration",
    ],
    image: PlaceholderImg,
    detail: {
      role: "Product Designer",
      tools: [
        { short: "Ai", label: "Adobe Illustrator" },
        { short: "Ps", label: "Adobe Photoshop" },
      ],
      overview: {
        title: "PROJECT OVERVIEW",
        text:
          "3 can design variants of soup-can/jar worthy liquids into portable " +
          "355mL drinking cans. The challenge was to pull recognizable design " +
          "aspects from similar reference material to make a refreshing, fun, " +
          "yet simple twist on product branding an otherwise unconventional concept.",
      },
      designThinking: {
        text:
          "The goal was to design something hip and simple. The colours were " +
          "bold, but slightly faded, as if mimicking the colour palette of some " +
          "popular minimalistic and modern soda can designs, while maintaining a " +
          "similar homey visual style to that of beer and soup cans.",
        contextText:
          "The visual design was built and inspired from sources of inspiration " +
          "such as Campbell's tomato soup cans, Bick's pickle jars, and Old Milwaukee beer cans.",
        carousel: [PlaceholderImg, PlaceholderImg, PlaceholderImg],
      },
      conceptRationale: {
        title: "CONCEPT & RATIONALE",
        text:
          'The resulting concept is the "Bueller\'s multipurpose brew" brand line. ' +
          "This set of beverage cans (which comes in 3 flavors) was created on the " +
          "idea of making a hybrid soup/liquid/beverage line built to take itself " +
          "seriously out of an otherwise odd, zany, and otherwise unconventional " +
          "product that would see itself in a soup/jarred goods aisle. The rationale " +
          "in making these flavors come alive was to practice and experiment with " +
          "marketing a niche brand to appeal to the public eye.",
      },
      finalResult: {
        title: "FINAL RESULT",
        dielines: [GingerDieline, PickleDieline, TomatoDieline],
      },
    },
  },
  {
    id: "montro-app-design",
    title: "MONTRO APP DESIGN",
    category: "uiux",
    kind: "project",
    tags: ["UI/UX Design", "App Design"],
    image: PlaceholderImg,
    detail: {
      role: "UI/UX Designer",
      tools: [{ short: "Fi", label: "Figma" }],
      overview: {
        title: "PROJECT OVERVIEW",
        text:
          "A mobile budgeting and expense tracking app designed for youth. The client challenge was to find a target demographic," +
          " study app competitors, and provide an app solution to hand off to a full-stack development team with a " +
          "branded identity, a prototype, and some promotional content. ",
      },
      designThinking: {
        text:
          "[Design thinking placeholder.] The process and rationale for the Montro " +
          "app design can be described here. Replace with your final content.",
        contextText:
          "The visual design was built and originally inspired by the splitwise app imbued" +
          " with a tech-punk colour scheme, but over a few iterations, the design took on a " +
          "much more fluid design. ",
        carousel: [PlaceholderImg],
      },
      conceptRationale: {
        title: "CONCEPT & RATIONALE",
        text:
          "The resulting concept is the “Montro”, the gamified expense tracker for young adults. " +
          "This app was made to build habits for young adults entering the adult world of expense" +
          " tracking by providing habit building tasks and sponsorlike rewards as a result. " +
          "The rationale in making this app was to tackle expense tracking in a way that was both " +
          "informative and fun for youth. Many expense trackers tend to bore and overwhelm young adults," +
          " and this was the solution to make the expense tracking journey rewarding. " +
          "Montro and the reasoning for key design decisions. Replace with your final content.",
      },
      finalResult: {
        title: "PROMO VIDEO",
        video: MontroPromoVideo,
      },
    },
  },
  {
    id: "rockies-motion-graphic",
    title: '"ROCKIES" MOTION GRAPHIC',
    category: "motion-graphics",
    kind: "project",
    tags: ["Graphic Design", "Motion Graphics"],
    image: PlaceholderImg,
    detail: {
      role: "Motion Designer",
      tools: [
        { short: "Ae", label: "Adobe After Effects" },
        { short: "Ai", label: "Adobe Illustrator" },
      ],
      overview: {
        title: "PROJECT OVERVIEW",
        text:
          'A short motion graphic inspired by vintage "Rockies" title cards. ' +
          "This placeholder entry can be updated later with final frames, " +
          "process notes, and a video embed once the piece is complete.",
      },
      designThinking: {
        text:
          "This section will eventually describe the concept, visual language, " +
          "and animation direction for the Rockies motion graphic.",
        contextText:
          "For now this is a lightweight placeholder so the card appears " +
          "consistently in the portfolio grid.",
        carousel: [PlaceholderImg],
      },
      conceptRationale: {
        title: "CONCEPT & RATIONALE",
        text:
          "Planned as a stylized bumper that combines bold typography, parallax " +
          "landscape layers, and grainy film texture to capture the feeling of " +
          "a late‑night cable movie intro.",
      },
      finalResult: {
        title: "FINAL RESULT",
        video: RockiesVideo,
      },
    },
  },
  {
    id: "company-poster-design",
    title: "COMPANY POSTER DESIGN",
    category: "graphic",
    kind: "project",
    tags: ["Graphic Design", "Branding", "Illustration"],
    image: PosterMockup1,
    detail: {
      heroImage: PosterMockup1,
      role: "Graphic Designer",
      tools: [
        { short: "Ai", label: "Adobe Illustrator" },
        { short: "Ps", label: "Adobe Photoshop" },
      ],
      overview: {
        title: "PROJECT OVERVIEW",
        text: "A poster concept created for a locally based blacksmithing company with an emphasis on bold typography, hierarchy, and clean visual storytelling.",
      },
      designThinking: {
        text: "The design approach explored layout balance, contrast, and visual rhythm to ensure key messaging remained readable at distance. The goal was to make something that was clear, a little playful, but at its core a business poster. This was an exercise to try and experiment with implementing logo design aside little details such as the engraving/etchin style details on the poster corners to fill space without detracting from the point.",
        contextText:
          "Iterations focused on balancing brand tone with strong call-to-action placement and supporting imagery.",
        carousel: [PosterDetail1, PosterDetail2, PosterDetail3],
      },
      conceptRationale: {
        title: "CONCEPT & RATIONALE",
        text: "The final output is a structured but simple poster set that guides the viewer's eye from headline to supporting details, reinforcing both clarity and brand identity of \"Copper Co\"'s services.",
      },
      finalResult: {
        title: "FINAL RESULT",
        posters: [AdPoster1, AdPoster2, AdPoster3],
      },
    },
  },
];
