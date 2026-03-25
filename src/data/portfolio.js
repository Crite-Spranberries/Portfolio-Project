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
import MotionGraphicTitlescreen from "../assets/img/motiongraphic_titlescreen.png";
import MotionGraphicDetail1 from "../assets/img/motiongraphic_detail1.png";
import MotionGraphicDetail2 from "../assets/img/motiongraphic_detail2.png";
import MotionGraphicDetail3 from "../assets/img/motiongraphic_detail3.png";
import MotionGraphicDetail4 from "../assets/img/motiongraphic_detail4.png";
import MotionGraphicDetail5 from "../assets/img/motiongraphic_detail5.png";
import RockiesVideo from "../assets/videos/Final Project 2295.mov";
import MontroPromoVideo from "../assets/videos/Montro_Promo_Med.mp4";
import MontroMockupTitle from "../assets/img/montro_mockup_title.png";
import MontroWebsiteCover from "../assets/img/montro_website_cover.png";
import MontroPromoWeb from "../assets/img/montro_promoweb.png";
import MontroFlowLogin from "../assets/img/montro_loginflow.png";
import MontroFlowReceipt from "../assets/img/montro_receiptflow.png";
import MontroUserFlow1 from "../assets/img/User Flow 1.png";
import MontroUserFlow2 from "../assets/img/User Flow 2.png";
import MontroFlowTracking from "../assets/img/montro_trackingflow.png";
import MontroFlowBudget from "../assets/img/montro_budgetflow.png";
import MontroFlowRewards from "../assets/img/montro_rewardflow.png";
import MontroFlowProfile from "../assets/img/montro_profileflow.png";
import MontroPersona1 from "../assets/img/montro_persona1.png";
import MontroPersona2 from "../assets/img/montro_persona2.png";
import MontroConcepts1 from "../assets/img/montro_concepts1.png";
import MontroConcepts2 from "../assets/img/montro_concepts2.png";
import MontroConcepts3 from "../assets/img/montro_concepts3.jpg";
import MontroConcepts4 from "../assets/img/montro_concepts4.png";
import PosterMockup1 from "../assets/img/poster_mockup1.png";
import SodaCanSetMockup from "../assets/img/sodacanset_mockup.png";
import CanDetail1 from "../assets/img/can_detail1.png";
import CanDetail2 from "../assets/img/can_detail2.png";
import CanDetail3 from "../assets/img/can_detail3.png";
import CanDetail4 from "../assets/img/can_detail4.png";

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

/**
 * Whether a project matches a single category pill (category id or tag-based filter).
 */
export function projectMatchesCategoryFilter(categoryDef, project) {
  if (!categoryDef || categoryDef.type === "all") return true;
  if (categoryDef.type === "category") return project.category === categoryDef.id;
  if (categoryDef.type === "tag" && categoryDef.tag) {
    return Array.isArray(project.tags) && project.tags.includes(categoryDef.tag);
  }
  return false;
}

/**
 * Multi-select filter: empty selection shows all projects; otherwise projects that
 * match **every** selected filter (AND). Toggle "All" clears selection.
 */
export function filterPortfolioProjectsBySelectedIds(projects, selectedCategoryIds) {
  if (!selectedCategoryIds?.length) return projects;
  const defs = selectedCategoryIds
    .map((id) => PORTFOLIO_CATEGORIES.find((c) => c.id === id))
    .filter(Boolean)
    .filter((c) => c.type !== "all");
  if (!defs.length) return projects;
  return projects.filter((project) =>
    defs.every((def) => projectMatchesCategoryFilter(def, project)),
  );
}

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
 * Detail page content (editable). Routing in `PortfolioDetail.jsx`:
 * - `kind: "case-study"` → case study layout (`renderCaseStudyBody`). Change that function for case-study-only UI.
 * - `kind: "project"` (default) → project layout (`renderProjectBody`).
 *
 * Shared `detail` shape below: case studies with `detail` use full bleed (research + optional prototype + design thinking).
 * Projects only use that full bleed for `montro-app-design`; other projects ignore `designLeadIn` / `prototypeFlows`.
 *
 * - role: string
 * - tools: Array<{ short: string, label: string }>  (short = icon label e.g. "Ai")
 * - overview: { title: string, text: string }
 * - designLeadIn?: (case studies, or Montro project — ignored for other projects)
 *     title?: string, // defaults to "RESEARCH & INSIGHT"
 *     text: string,
 *     contextText?: string,
 *     carousel?: string[] // optional; right column research carousel (if no personas)
 *     personas?: string[] // optional; persona images (see layout below)
 *     userFlows?: string[] // optional; with personas: right carousel (e.g. User Flow 1 & 2 exports)
 *     userFlowsTitle?: string // defaults to "INITIAL USER FLOWS"
 *     personasTitle?: string // defaults to "USER PERSONAS"
 * - prototypeFlows?: (case studies, or Montro project — ignored for other projects)
 *     title?: string, // defaults to "FIGMA PROTOTYPE"
 *     text: string,
 *     contextText?: string,
 *     carousel?: string[] // optional; falls back to prototypeFlowsImage or project.image
 *   }
 *   Optional: prototypeFlowsImage — between Research & Insight and Design Thinking (no black bleed)
 * - designThinking: {
 *     text: string,
 *     contextText?: string,
 *     carousel?: string[] // optional: image sequence for Design Thinking carousel
 *   }
 *   Optional: heroImage, designThinkingImage (override project.image for that section)
 * - conceptRationale: { title: string, text: string }
 * - finalResult: {
 *     title?: string,
 *     buttonText?: string,
 *     video?: string,
 *     videoTitle?: string, // header above video when using linkPair
 *     linkPair?: {
 *       left: { title: string, image: string, href: string },
 *       right: { title: string, image: string, href: string },
 *     }
 *   }
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
      designLeadIn: {
        title: "RESEARCH & INSIGHT",
        text:
          "[Placeholder.] Early research, constraints, and product direction can be summarized here " +
          "in the same style as Design Thinking—replace with interviews, competitive notes, or technical scope.",
        contextText:
          "Optional supporting context in italics: key findings, personas, or risks that shaped the build.",
        carousel: [PlaceholderImg],
      },
      prototypeFlows: {
        title: "FIGMA PROTOTYPE",
        text:
          "[Placeholder.] Summarize the interactive prototype: key flows, fidelity, and what was validated before build.",
        contextText:
          "Optional: paste a Figma link in this string to show a clickable link (see Montro case study).",
        carousel: [PlaceholderImg],
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
    image: SodaCanSetMockup,
    detail: {
      heroImage: SodaCanSetMockup,
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
          "similar homey visual style to that of beer and soup cans. This is reflected " +
          "from the utilization of graphic real-estate, the logo styling, and the " +
          "texture/colour of the can overall. The French translations were also to be significantly considered in dividing space for layout.",
        contextText:
          "The visual design was built and inspired from sources of inspiration " +
          "such as Campbell's tomato soup cans, Bick's pickle jars, and Old Milwaukee beer cans.",
        carousel: [CanDetail1, CanDetail2, CanDetail3, CanDetail4],
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
        title: "FINAL RESULT (DIELINES)",
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
    image: MontroMockupTitle,
    detail: {
      heroImage: MontroMockupTitle,
      role: "UI/UX Designer",
      tools: [{ short: "Fi", label: "Figma" }],
      overview: {
        title: "PROJECT OVERVIEW",
        text:
          "A mobile budgeting and expense tracking app designed for youth. The client challenge was to find a target demographic," +
          " study app competitors, and provide an app solution to hand off to a full-stack development team with a " +
          "branded identity, a prototype, and some promotional content. This was developed in a team of 8.",
      },
      designLeadIn: {
        title: "IDEATION & RESEARCH",
        text:
          "We surveyed local financial app users to guide ideation. About half said they track spending and half do not. " +
          "Among those who tried tracking, roughly 85% stopped while 15% continued. The main drop-off reasons were " +
          "that tracking felt boring and time-consuming, easy to forget, and eventually overwhelming or stressful, " +
          "especially in manual spreadsheet-style flows. These findings directly informed our personas and UX priorities.",
        contextText:
          "Structured interviews with 10 participants informed the findings summarized above.",
        personas: [MontroPersona1, MontroPersona2],
        userFlows: [MontroUserFlow1, MontroUserFlow2],
        userFlowsTitle: "INITIAL USER FLOWS",
      },
      prototypeFlows: {
        title: "FIGMA PROTOTYPE",
        text:
          "The following are the final prototype flows for the montro app, built in figma. After research, user testing, and the initial" +
          " lo-fi models, this ended up being the final layout and visual result of the app.",
        contextText:
          "Alternatively, directly view our figma link here: https://www.figma.com/design/m941MXTjIgArJgKf7thszG/Wireframes?node-id=1585-12406&p=f&t=PwtDNnSjt8p89WSZ-0",
        carousel: [
          MontroFlowLogin,
          MontroFlowReceipt,
          MontroFlowTracking,
          MontroFlowBudget,
          MontroFlowRewards,
          MontroFlowProfile,
        ],
      },
      designThinking: {
        text:
          "Montro went through various iterations of visual design, but it settled on a modern, minimalistic design with a focus on usability" +
          " and accessibility. Initially, the goal was to make a digital, tech-punk styled app that looked similar to that of a futuristic numbers-based mobile game. ",
        contextText:
          "The visual design was built and originally inspired by splitwise and spotify imbued" +
          " with a tech-punk colour scheme. Over a few iterations, the design took on the " +
          "fluid design you see before you. ",
        carousel: [
          MontroConcepts1,
          MontroConcepts2,
          MontroConcepts3,
          MontroConcepts4,
        ],
      },
      conceptRationale: {
        title: "CONCEPT & RATIONALE",
        text:
          "The resulting concept is “Montro”, the gamified expense tracker for young adults. " +
          "This app was made to build habits for young adults entering the adult world of expense" +
          " tracking by providing habit building tasks and sponsorlike rewards as a result. " +
          "The rationale in making this app was to tackle expense tracking in a way that was both " +
          "informative and fun for youth. Many expense trackers tend to bore and overwhelm young adults," +
          " and this was the solution to make the expense tracking journey rewarding.",
      },
      finalResult: {
        videoTitle: "PROMO VIDEO",
        video: MontroPromoVideo,
        linkPair: {
          left: {
            title: "LIVE WEBSITE",
            image: MontroWebsiteCover,
            href: "https://frontend-zyfs.onrender.com/",
          },
          right: {
            title: "PROMO WEBSITE",
            image: MontroPromoWeb,
            href: "https://montro.framer.website",
          },
        },
      },
    },
  },
  {
    id: "rockies-motion-graphic",
    title: '"ROCKIES" MOTION GRAPHIC',
    category: "motion-graphics",
    kind: "project",
    tags: ["Graphic Design", "Motion Graphics"],
    image: MotionGraphicTitlescreen,
    detail: {
      role: "Motion Designer",
      tools: [
        { short: "Ae", label: "Adobe After Effects" },
        { short: "Ai", label: "Adobe Illustrator" },
      ],
      overview: {
        title: "PROJECT OVERVIEW",
        text:
          "A minute-long motion graphic video tutorial about the basics you'll need on a trip to the Canadian Rockies. " +
          "Inspired by my roadtrips from the Lower Mainland to the Rockies and through to Alberta. " +
          "The motion graphic picture features a soft colour palette, custom vector graphics, and a narration from yours truly. ",
      },
      designLeadIn: {
        title: "RESEARCH & INSIGHT",
        text:
          "[Placeholder.] Story beats, reference films, and rough style frames that preceded the final Rockies piece—" +
          "replace with your real process notes when ready.",
        contextText:
          "Optional: pacing, narration tone, or Alberta road-trip inspiration in italics.",
        carousel: [PlaceholderImg],
      },
      designThinking: {
        text:
          "The design follows plenty of warm colours to express a sense of sunniness, adventure, and hominess." +
          " The graphics and approach is styled based on informatic graphic videos that feature simple vector visuals." +
          " This was done to invoke a sense of campiness, simplicity, and a sense of adventure.",
        contextText:
          "From the choice of the fonts, colour palette, and graphic style, the composition was designed to make this " +
          "tutorial feel as professional as a proper infographic, and as comfortable as a conversation over a bonfire.",
        carousel: [
          MotionGraphicDetail1,
          MotionGraphicDetail2,
          MotionGraphicDetail3,
          MotionGraphicDetail4,
          MotionGraphicDetail5,
        ],
      },
      conceptRationale: {
        title: "CONCEPT & RATIONALE",
        text:
          "The final result of this project exercises the ability to create motion graphics that flow consistently," +
          " incorporating vector graphics and " +
          "strategically used visual effects to make a structured composition with a clear narrative.",
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
