export interface CohortConfig {
  id: string;
  name: string;
  startDate: string;
  venue: {
    name: string;
    address: string;
    mapUrl: string;
  };
  sessionTime: {
    start: string;
    end: string;
  };
  links: {
    slack: string;
    github: string;
    officeHours: string;
  };
}

export interface WeekFrontmatter {
  week: number;
  title: string;
  format: string;
  phase: number;
  sessionDate: string;
  prework?: {
    timeEstimate: string;
  };
  outcomes?: string[];
  colabUrl?: string;
  workbookUrl?: string;
  slidesUrl?: string | null;
  deliverable?: {
    description: string;
    dueDate: string;
  };
  references?: {
    title: string;
    url: string;
  }[];
}

export interface WeekContent {
  frontmatter: WeekFrontmatter;
  body: string;
}

export type WeekState = 'past' | 'current' | 'upcoming';
