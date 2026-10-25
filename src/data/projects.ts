// ============================================================
// PROJECT DATA TYPES
// ============================================================

export type MediaType = {
  type: 'image' | 'video' | 'lottie';
  src: string;
  alt?: string;
  poster?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '4/5' | 'full';
  objectPosition?: string;
  transform?: string;
  transformOrigin?: string;
};

export type SectionType =
  | { type: 'text'; heading?: string; body: string }
  | { type: 'full-media'; media: MediaType; caption?: string }
  | { type: 'text-media'; heading?: string; body: string; media: MediaType; mediaPosition?: 'left' | 'right' }
  | { type: 'video'; media: MediaType; caption?: string }
  | { type: 'gallery'; images: MediaType[]; columns?: 2 | 3 | 4 }
  | { type: 'image-grid'; images: MediaType[] }
  | { type: 'insight'; label?: string; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'process'; steps: { label: string; description: string }[] }
  | { type: 'embed'; src: string; title?: string; height?: string };

export type ProjectMetaType = {
  role?: string;
  client?: string;
  timeline?: string;
  scope?: string;
  team?: string;
  skills?: string[];
};

export type Project = {
  id: string;
  slug: string;
  number: string;
  title: string;
  description: string;
  year: string;
  categories: string[];
  thumbnail: MediaType;
  heroMedia?: MediaType;
  meta?: ProjectMetaType;
  sections: SectionType[];
};

// ============================================================
// PLACEHOLDER PROJECT DATA
// ============================================================

export const projects: Project[] = [
  {
    id: 'project-01',
    slug: 'project-01',
    number: '01',
    title: 'Planefold',
    description: "Designing Product strategy, visual direction and website design for Planefold’s new product line.",
    year: '2026',
    categories: ['Internship', 'Website Design', 'Design System'],
    thumbnail: {
      type: 'image',
      src: '/images/planefold-thumbnail.png',
      alt: 'Planefold project cover thumbnail',
      aspectRatio: '16/9',
      objectPosition: 'center center',
    },
    heroMedia: {
      type: 'video',
      src: '/images/planefold-animation.mp4',
      alt: 'Planefold hero video',
      aspectRatio: '16/9',
      objectPosition: 'center 75%',
    },
    meta: {
      role: 'Product Designer',
      client: 'Planefold',
      timeline: '2026',
      scope: 'Website Design, Research, Visual Design',
    },
    sections: [
      {
        type: 'embed',
        src: '/plixet-final.html',
        title: "Designing Product strategy, visual direction and website design for Planefold’s new product line.",
      },
    ],
  },
  {
    id: 'project-02',
    slug: 'project-02',
    number: '02',
    title: 'Klenzaa',
    description: 'Designed the host-side MVP for Klenzaa, a marketplace that connects vacation-rental hosts with cleaners.',
    year: '2025',
    categories: ['Freelance', 'Dashboard', '0 to 1'],
    thumbnail: {
      type: 'image',
      src: '/images/klenzaa-thumbnail.png',
      alt: 'Klenzaa project cover thumbnail',
      aspectRatio: '16/9',
    },
    heroMedia: {
      type: 'lottie',
      src: '/images/klenzaaheromedia.json',
      alt: 'Klenzaa hero animation',
      aspectRatio: '16/9',
    },
    meta: {
      role: 'Sole UI/UX Designer',
      client: 'Clik Catalyst Agency & Imparable Tech Pvt Ltd',
      timeline: 'Oct to Dec 2025, 3 months',
      scope: 'Host side product, end to end',
    },
    sections: [
      {
        type: 'embed',
        src: '/klenzaa-final.html',
        title: 'Designed the host-side MVP for Klenzaa, a marketplace that connects vacation-rental hosts with cleaners.',
        height: '900px',
      },
    ],
  },
  {
    id: 'project-03',
    slug: 'project-03',
    number: '03',
    title: 'Saheli',
    description: "Designed a gig-work app for women, where the hard part isn't finding jobs, it's deciding to start.",
    year: '2026',
    categories: ['Self-initiated', 'Mobile App', 'Social Impact'],
    thumbnail: {
      type: 'image',
      src: '/images/saheli-thumbnail.png',
      alt: 'Saheli project cover thumbnail',
      aspectRatio: '16/9',
      objectPosition: 'center center',
    },
    heroMedia: {
      type: 'video',
      src: '/images/heromediasaheli.mp4',
      alt: 'Saheli hero animation',
      aspectRatio: '16/9',
      objectPosition: 'center top',
      transform: 'scale(1.10)',
      transformOrigin: 'center top',
    },
    meta: {
      role: 'UX/UI Designer, Solo',
      client: 'Academic',
      timeline: '4 months',
      scope: 'Semester Project',
    },
    sections: [
      {
        type: 'embed',
        src: '/saheli-final.html',
        title: "Designed a gig-work app for women, where the hard part isn't finding jobs, it's deciding to start.",
      },
    ],
  },
  {
    id: 'whatsapp',
    slug: 'whatsapp',
    number: '04',
    title: 'WhatsApp Redesign',
    description: 'Case study exploration for WhatsApp.',
    year: '2024',
    categories: ['Product Design', 'UI/UX', 'Mobile App'],
    thumbnail: {
      type: 'image',
      src: '/images/Group 1.png',
      alt: 'WhatsApp Case Study',
      aspectRatio: '16/9',
    },
    sections: [
      {
        type: 'embed',
        src: '/whatsapp-final.html',
        title: 'WhatsApp Case Study',
      },
    ],
  },
];

// Helper: get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

// Helper: get next project
export function getNextProject(slug: string): Project | undefined {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return undefined;
  return projects[(idx + 1) % projects.length];
}

// Playground items
export type PlaygroundItem = {
  id: string;
  title: string;
  category: string;
  description?: string;
  media?: MediaType;
  embedUrl?: string;
  link?: string;
  aspectRatio?: string;
};

export const playgroundItems: PlaygroundItem[] = [
  {
    id: 'exp-01',
    title: 'Ripple Image Effect',
    category: 'Interactive / WebGL',
    description: 'An interactive liquid ripple distortion effect built with VS Code, its AI Agent and custom shaders.',
    media: {
      type: 'video',
      src: '/images/exp-01.mp4',
      alt: 'Ripple Image Effect video preview',
      aspectRatio: '16/9',
    },
    embedUrl: 'https://ripple-image-effect.vercel.app/',
    link: 'https://ripple-image-effect.vercel.app/',
    aspectRatio: '16/9',
  },
  {
    id: 'exp-02',
    title: 'Kinetic Typography',
    category: 'Typography & Motion',
    description: 'Experimental kinetic typography and animated text exploration.',
    media: {
      type: 'video',
      src: '/images/animation-typo.mp4',
      alt: 'Kinetic Typography animation video',
      aspectRatio: '16/9',
    },
    aspectRatio: '16/9',
  },
  {
    id: 'exp-03',
    title: 'Calendar Exploration',
    category: 'Interactive / UI Component',
    description: 'Stroll turns my endless online rabbit holes into a visual scrapbook, making it easier to revisit, connect, and continue explorations.(with time stamps!!)',
    media: {
      type: 'image',
      src: '/images/exp-04.png',
      alt: 'Calendar Exploration preview',
      aspectRatio: '16/9',
    },
    embedUrl: 'https://exploration-calender.vercel.app/',
    link: 'https://exploration-calender.vercel.app/',
    aspectRatio: '16/9',
  },
  {
    id: 'exp-04',
    title: '3D World of Mine',
    category: 'Interactive / 3D & WebGL',
    description:
      'This is a work in progress and I am still working and exploring on it!\nBuilt with Three.js, React Three Fiber, and custom GLSL shaders to explore interactive storytelling in the browser.\nTell me what you think!',
    media: {
      type: 'video',
      src: '/images/3dworld.mp4',
      alt: '3D World of Mine video preview',
      aspectRatio: '16/9',
    },
    embedUrl: 'https://3dworldofmine.vercel.app/',
    link: 'https://3dworldofmine.vercel.app/',
    aspectRatio: '16/9',
  },
];