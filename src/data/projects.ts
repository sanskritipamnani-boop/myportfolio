// ============================================================
// PROJECT DATA TYPES
// ============================================================

export type MediaType = {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '4/5' | 'full';
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
    description: 'A short placeholder description for this project. This text will be replaced with your final copy.',
    year: '2026',
    categories: ['Product Design', 'UX Research', 'Systems'],
    thumbnail: {
      type: 'image',
      src: '/planefold.png',
      alt: 'Planefold thumbnail',
      aspectRatio: '16/9',
    },
    heroMedia: {
      type: 'image',
      src: '/planefold.png',
      alt: 'Planefold hero',
      aspectRatio: '16/9',
    },
    sections: [
      {
        type: 'text',
        heading: 'Context',
        body: 'Placeholder context for Project 01. This section describes the background and the problem space. Replace with your actual case study copy when ready.',
      },
      {
        type: 'full-media',
        media: {
          type: 'image',
          src: '/placeholder-02.jpg',
          alt: 'Project 01 — full width image',
          aspectRatio: '16/9',
        },
        caption: 'A placeholder caption for this image.',
      },
      {
        type: 'insight',
        label: 'Key Insight',
        text: 'Placeholder insight. A short, punchy statement that captures the core finding or opportunity.',
      },
      {
        type: 'text-media',
        heading: 'Process',
        body: 'Placeholder process description. This explains the approach taken to solve the problem. Replace this with your actual methodology and decision-making rationale.',
        media: {
          type: 'image',
          src: '/placeholder-03.jpg',
          alt: 'Project 01 — process image',
          aspectRatio: '1/1',
        },
        mediaPosition: 'right',
      },
      {
        type: 'gallery',
        images: [
          { type: 'image', src: '/placeholder-02.jpg', alt: 'Gallery image 1', aspectRatio: '4/3' },
          { type: 'image', src: '/placeholder-03.jpg', alt: 'Gallery image 2', aspectRatio: '4/3' },
          { type: 'image', src: '/placeholder-01.jpg', alt: 'Gallery image 3', aspectRatio: '4/3' },
        ],
        columns: 3,
      },
      {
        type: 'quote',
        text: '"Placeholder quote. A key statement, user feedback, or reflection that captures something important about this project."',
        attribution: '— Placeholder attribution',
      },
      {
        type: 'text',
        heading: 'Reflection',
        body: 'Placeholder reflection. What you learned, what would be done differently, and what impact the project had.',
      },
    ],
  },
  {
    id: 'project-02',
    slug: 'project-02',
    number: '02',
    title: 'Klenzaa',
    description: 'Klenzaa Brand Identity and Interactive Case Study.',
    year: '2025',
    categories: ['Brand Identity', 'Visual Design'],
    thumbnail: {
      type: 'image',
      src: '/title-screen.png',
      alt: 'Klenzaa thumbnail',
      aspectRatio: '16/9',
    },
    sections: [
      {
        type: 'embed',
        src: '/klenzaa-final.html',
        title: 'Designing Klenzaa',
        height: '900px',
      },
    ],
  },
  {
    id: 'project-03',
    slug: 'project-03',
    number: '03',
    title: 'Project 03',
    description: 'Third placeholder project. A short summary of the work and its focus area.',
    year: '2024',
    categories: ['Interaction Design', 'Prototyping'],
    thumbnail: {
      type: 'image',
      src: '/placeholder-03.jpg',
      alt: 'Project 03 thumbnail',
      aspectRatio: '16/9',
    },
    heroMedia: {
      type: 'image',
      src: '/placeholder-03.jpg',
      alt: 'Project 03 hero',
      aspectRatio: '16/9',
    },
    sections: [
      {
        type: 'text',
        heading: 'Overview',
        body: 'Placeholder overview for Project 03.',
      },
      {
        type: 'text-media',
        heading: 'Research',
        body: 'Placeholder research description. What was investigated, who was spoken to, what patterns emerged.',
        media: {
          type: 'image',
          src: '/placeholder-01.jpg',
          alt: 'Project 03 — research image',
          aspectRatio: '4/3',
        },
        mediaPosition: 'left',
      },
      {
        type: 'quote',
        text: '"A placeholder quote for Project 03."',
        attribution: '— Placeholder',
      },
      {
        type: 'full-media',
        media: {
          type: 'image',
          src: '/placeholder-02.jpg',
          alt: 'Project 03 — final image',
          aspectRatio: '16/9',
        },
        caption: 'Placeholder caption.',
      },
      {
        type: 'text',
        heading: 'Reflection',
        body: 'Placeholder reflection for Project 03.',
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
  media: MediaType;
  link?: string;
};

export const playgroundItems: PlaygroundItem[] = [
  {
    id: 'exp-01',
    title: 'Experiment 01',
    category: 'Motion',
    description: 'A short description of this experiment.',
    media: { type: 'image', src: '/placeholder-03.jpg', alt: 'Experiment 01', aspectRatio: '1/1' },
  },
  {
    id: 'exp-02',
    title: 'Experiment 02',
    category: 'Typography',
    description: 'Exploring typographic layouts.',
    media: { type: 'image', src: '/placeholder-02.jpg', alt: 'Experiment 02', aspectRatio: '4/3' },
  },
  {
    id: 'exp-03',
    title: 'Experiment 03',
    category: 'Interaction',
    media: { type: 'image', src: '/placeholder-01.jpg', alt: 'Experiment 03', aspectRatio: '16/9' },
  },
  {
    id: 'exp-04',
    title: 'Experiment 04',
    category: 'Visual',
    description: 'A visual exploration.',
    media: { type: 'image', src: '/placeholder-03.jpg', alt: 'Experiment 04', aspectRatio: '4/3' },
  },
];