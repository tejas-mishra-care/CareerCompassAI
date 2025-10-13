# Application Blueprint: CareerCompassAI

This document outlines the architecture and core concepts behind the CareerCompassAI application. It is a living document that will evolve as the application grows.

## 1. The Core Engine: A Trinity of Components

The application is built on three foundational pillars that work together to create a deeply personalized user experience.

-   **The Dynamic User Profile (The "Soul"):** This is more than just a user record; it's a "living CV" stored in a Firestore document. It contains the user's ..skills, proficiency levels, goals, active learning pathways, and a history of their achievements. This profile is updated in real-time, serving as the central source of truth for the entire application. The `useUserProfile` hook provides seamless, real-time access to this data across all components.

-   **The Personalization Engine (The "Brain"):** This is a collection of server-side Genkit AI flows. These flows act as the application's intelligence, processing the user's Dynamic Profile to generate tailored content, recommendations, and insights. This engine is responsible for everything from creating the initial user profile to suggesting career paths and matching users with opportunities.

-   **The Experiential UI (The "Nervous System"):** This is the Next.js and React frontend. It's designed to be more than just a display layer; it's an interactive environment. Through features like the Onboarding Stepper, Learning Pathways, and the Simulation Library, the UI actively engages the user, captures their progress, and feeds that data back into their Dynamic User Profile, creating a virtuous cycle of growth and personalization.

## 2. Key Features & User Journey

The application is designed around a comprehensive user lifecycle, guiding them from self-discovery to career readiness.

-   **Intelligent Onboarding (`/profile`):** The user's journey begins with a gamified, multi-step onboarding process that feels more like a conversation than a form. It captures their academic history, passions, and aptitudes. The `createProfileFromOnboarding` AI flow then synthesizes this data into a rich, foundational user profile, complete with an initial skill map and a professional bio.

-   **The Dashboard (`/dashboard`):** This is the user's personalized home base. It provides an at-a-glance view of their `SkillDashboard` (a radar chart of their top skills), their `ActivePathways`, and AI-driven `Recommendations` for their next steps.

-   **Learning Pathways (`/pathways`):** The `LearningPathwayGenerator` allows users to generate custom, step-by-step learning plans for any skill or career. Once a pathway is started, it's added to their profile, and they can track their progress, earning Skill Points (SP) as they complete each step.

-   **The Experiential Library (`/simulations`):** This is where users can "test-drive" their future careers. The library contains interactive simulations, such as the `mock-interview`, that challenge users to apply their skills in real-world scenarios, earning significant SP upon completion.

-   **Connect & Share (`/connect`):** This feature acknowledges that career development isn't a solo journey. It provides a secure way for users to share their progress with parents, guardians, and career counselors, fostering a supportive ecosystem around the user.

## 3. High-Impact Features

These modules leverage the core engine to deliver proactive, high-value experiences that make the platform an indispensable career tool.

-   **Opportunity Radar:** A proactive job and internship matching engine. This feature utilizes an AI flow (`opportunity-radar`) to analyze the user's live skill profile and match it against simulated, realistic job listings relevant to the Indian market. It calculates a "Match Score" for each opportunity, directly answering the user's question, "What can I do with my skills *right now*?". This transforms the platform from just a learning tool into a career progression tool.

-   **AI Mock Interview Simulator:** A powerful training ground for interview preparation. Found within the Experiential Library, this feature uses a dedicated AI flow (`mock-interview-flow`) to generate relevant technical and behavioral questions for a user-specified job role. After the user provides an answer, the AI delivers instant, constructive feedback, helping them refine their communication and storytelling skills in a safe, private environment.

-   **Community & Mentorship Hub:** This feature adds a vital social layer to the application, fostering a network effect. The UI is structured to support Peer Groups (for collaborative learning), Q&A Forums (for crowd-sourced wisdom), and a Mentor Connect program to link users with experienced professionals. It aims to build the professional network users need to succeed.

## 4. Architectural Refinements

As the application has evolved, several key architectural decisions have been made to ensure scalability, resilience, and cost-effectiveness.

-   **Robust Error Handling:** The `ProfileProcessor` component, which handles the initial AI-driven profile creation, now includes a dedicated error state. If the Genkit flow fails, the user is presented with a clear error message and a retry button, preventing them from being stuck in a permanent loading state.

-   **Intelligent Caching for AI Flows:** To manage API costs and improve performance, AI-generated content like career recommendations and job opportunities are cached within the user's Firestore document. A timestamp (`recommendationsLastUpdated`, `opportunitiesLastUpdated`) is stored alongside the data. The frontend logic is configured to only re-run the expensive AI flows if the cached data is more than one week old, striking a balance between freshness and efficiency.

-   **Optimized Data Modeling for Queries:** Key fields from the `onboardingData` object (such as `stream12th` and `goal`) are promoted to top-level properties on the `UserProfile` document. This data denormalization makes it significantly more efficient to query and index users based on critical onboarding answers, which would be slow and costly if the data remained nested inside a large JSON blob.

## 5. Data Models

The core data model for the application is the `UserProfile`.

```typescript
// src/lib/types.ts

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

export interface UserProfile {
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

  // Cached AI recommendations
  recommendations?: CareerRecommendationsOutput;
  recommendationsLastUpdated?: number; // Firestore timestamp

  // Cached AI opportunities
  opportunities?: Opportunity[];
  opportunitiesLastUpdated?: number; // Firestore timestamp
}
```////
