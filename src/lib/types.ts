
import type { CareerRecommendationsOutput } from "@/ai/flows/career-recommendations-from-profile";
import type { Opportunity } from "@/ai/flows/opportunity-radar";

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
    href?: string;
}

export interface ImagePlaceholder {
    id: string;
    description: string;
    imageUrl: string;
    imageHint: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  bio: string;
  skills: Skill[];
  activePathways?: Pathway[];
  
  // Onboarding-specific fields
  onboardingCompleted?: boolean;
  onboardingData?: any; // Stores the raw output from the stepper form
  
  // Fields promoted for querying
  stream12th?: string;
  goal?: string;
  timeAvailability?: string;

  // Cached AI recommendations
  recommendations?: CareerRecommendationsOutput;
  recommendationsLastUpdated?: number; // Firestore timestamp

  // Cached AI opportunities
  opportunities?: Opportunity[];
  opportunitiesLastUpdated?: number; // Firestore timestamp
}
