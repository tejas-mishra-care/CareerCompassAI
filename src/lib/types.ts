export interface Skill {
  name: string;
  proficiency: number; // 0-100
}

export interface PathwayStep {
  title: string;
  description: string;
  completed: boolean;
}

export interface Pathway {
  title: string;
  steps: PathwayStep[];
}

export interface Simulation {
    id: string;
    title: string;
    description: string;
    skills: string[];
    spYield: number;
    imageHint: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  skills: Skill[];
  activePathways?: Pathway[];
}
