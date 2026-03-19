import MonkeyImg from "../assets/img/monkey.png";
import PlaceholderImg from "../assets/img/placeholder.jpg";
import GingerDieline from "../assets/img/Ginger Juice Variant@2x.png";
import PickleDieline from "../assets/img/Pickle Juice Variant@2x.png";
import TomatoDieline from "../assets/img/Tomato Juice Variant@2x.png";
import RockiesVideo from "../assets/videos/Final Project 2295.mov";

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
    title: "SafeSpace App",
    category: "uiux",
    kind: "case-study",
    tags: ["Full Stack Development", "UI/UX Design", "App Design"],
    image: PlaceholderImg,
    detail: {
      role: "Lead Full Stack Developer",
      tools: [],
      overview: {
        title: "Overview",
        text: "...",
      },
      designThinking: {
        text: "...",
        contextText: "...",
        carousel: [PlaceholderImg],
      },
      conceptRationale: {
        title: "Concept & Rationale",
        text: "..." + "...",
      },
      finalResult: {
        title: "Final Result",
        buttonText: "View prototype",
      },
    },
  },
  {
    id: "can-product-design",
    title: "Can Product Design",
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
        title: "Project Overview",
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
        title: "Concept & Rationale",
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
        title: "Final Result",
        dielines: [GingerDieline, PickleDieline, TomatoDieline],
      },
    },
  },
  {
    id: "montro-app-design",
    title: "Montro App Design",
    category: "uiux",
    kind: "project",
    tags: ["UI/UX Design", "App Design"],
    image: PlaceholderImg,
    detail: {
      role: "UI/UX Designer",
      tools: [{ short: "Fi", label: "Figma" }],
      overview: {
        title: "Project Overview",
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
        title: "Concept & Rationale",
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
        title: "Final Result",
        buttonText: "Preview Website",
      },
    },
  },
  {
    id: "rockies-motion-graphic",
    title: '"Rockies" Motion Graphic',
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
        title: "Project Overview",
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
        title: "Concept & Rationale",
        text:
          "Planned as a stylized bumper that combines bold typography, parallax " +
          "landscape layers, and grainy film texture to capture the feeling of " +
          "a late‑night cable movie intro.",
      },
      finalResult: {
        title: "Final Result",
        video: RockiesVideo,
      },
    },
  },
];
