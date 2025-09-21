# Application Blueprint: CareerCompassAI

This document outlines the core architecture and user flow for the CareerCompassAI application.

---

## 1. Core Philosophy: The Human-AI Symbiosis

CareerCompassAI is not just a tool; it's a partnership. The core philosophy is to augment the human experience—for students, parents, and counselors—with the power of AI. It provides data-driven insights and personalized roadmaps, enabling more informed and empathetic guidance.

---

## 2. The Trinity Architecture

The application is built on three foundational pillars:

### a. The Dynamic User Profile (The "Soul")

-   **What it is:** A comprehensive, "living" profile for each user, stored as a single document in Firestore (`/users/{userId}`). It's the application's single source of truth for an individual.
-   **Implementation:**
    -   **Data Model (`src/lib/types.ts`):** The `UserProfile` interface defines the structure, including `name`, `bio`, `skills`, `activePathways`, and the crucial `onboardingData`.
    -   **Real-time Synchronization (`src/hooks/use-user-profile.tsx`):** The `useUserProfile` hook uses a real-time Firestore `onSnapshot` listener. This ensures that any change to the user's document in the database is immediately reflected across the entire application without needing a page refresh.

### b. The Knowledge Graph (The "Brain")

-   **What it is:** A vast, implicit network of information about careers, skills, courses, and learning pathways. This "brain" is powered by Google's Gemini models.
-   **Implementation:**
    -   **Genkit AI Flows (`src/ai/flows/*.ts`):** A suite of specialized Genkit flows acts as the interface to the AI. Each flow is a purpose-built "expert" (e.g., `createProfileFromOnboarding`, `getCareerRecommendations`). They take user data as input and return structured, actionable JSON.
    -   **Zod Schemas:** Each flow uses `zod` to define strict input and output schemas, ensuring data consistency and type safety between the application and the AI.

### c. The Personalization Engine (The "Nervous System")

-   **What it is:** The active process that connects the User Profile to the Knowledge Graph. It's responsible for fetching, interpreting, and displaying personalized content.
-   **Implementation:**
    -   **React Components (`src/components/**/*.tsx`):** Components like `Recommendations`, `UnifiedSearch`, and `LearningPathwayGenerator` act as the "nerves." They use the `useUserProfile` hook to get the user's data and then call the appropriate Genkit flow to generate personalized content.

---

## 3. The User Journey & Core Features

### a. Onboarding: The First Handshake

-   **Goal:** To gather enough information to build a valuable, personalized initial profile without overwhelming the user.
-   **Implementation:**
    1.  **Trigger:** A new user is directed to `/profile`, where `onboardingCompleted: false` triggers the `OnboardingStepper`.
    2.  **The Stepper (`src/components/onboarding/onboarding-stepper.tsx`):** A multi-step form that collects academic history, higher education details, interests, and aptitude quiz answers. It's designed to feel like a "calibration journey."
    3.  **Finish & Redirect:** Upon clicking "Finish," the stepper performs **one simple, reliable action**: it saves the complete, raw form data to `onboardingData` in the user's Firestore document and sets `onboardingCompleted: true`. It then immediately redirects to `/dashboard`. This decouples the slow AI processing from the user's form submission action.

### b. Profile Generation: The AI's First Task

-   **Goal:** To transform the raw onboarding data into a structured, insightful user profile.
-   **Implementation:**
    1.  **The Processor (`src/components/dashboard/profile-processor.tsx`):** After being redirected, the dashboard sees that `onboardingCompleted` is true but the profile is still missing a `bio` and `skills`. It renders the `ProfileProcessor` component.
    2.  **Asynchronous AI Call:** This component displays a loading state (e.g., "Calibrating your compass...") while it calls the `createProfileFromOnboarding` Genkit flow in the background, sending the `onboardingData`.
    3.  **Real-time Update:** Once the AI returns the generated `bio` and `skills`, the `ProfileProcessor` updates the user's document in Firestore. The `onSnapshot` listener in the `useUserProfile` hook automatically picks up this change, and the dashboard seamlessly re-renders to show the complete, personalized view.

### c. Gamified Skill Progression

-   **Goal:** To create an engaging feedback loop that encourages learning and growth.
-   **Implementation:**
    -   **Skill Points (SP):** The `proficiency` field in the `Skill` model acts as the user's SP for that skill.
    -   **Pathway Completion:** Completing steps in a `Pathway` (`src/app/(pages)/pathways/[pathwayId]/page.tsx`) increases the SP of related skills, providing tangible rewards for learning.
    -   **Visualization:** Components like `SkillDashboard` and `SkillRadarChart` provide a clear, visual representation of the user's strengths and progress.

### d. The Human Layer

-   **Goal:** To facilitate meaningful conversations between users, counselors, and parents.
-   **Implementation:** The `ConnectPage` provides a dedicated space for this, with stubs for "Counselor Connect" and a "Parent & Guardian Portal," allowing for future integration of sharing and collaboration features.

---

## 4. Architectural Refinements

Based on initial development, the following architectural improvements have been implemented to ensure scalability, reliability, and cost-effectiveness.

### a. Error Handling in `ProfileProcessor`

-   **Challenge:** The `createProfileFromOnboarding` AI flow could potentially fail, leaving the user stuck in a loading state.
-   **Solution:** The `ProfileProcessor` component now includes a robust `try...catch` block. If the AI flow returns an error, the component displays an error state with a user-friendly message and a "Try Again" button, allowing the user to re-initiate the process.

### b. Cost Management via Caching

-   **Challenge:** AI-driven features like career recommendations could become expensive if the AI flow is called on every page load.
-   **Solution:** A caching mechanism has been implemented for AI recommendations.
    1.  The `UserProfile` model now includes `recommendations` and `recommendationsLastUpdated` fields.
    2.  The `Recommendations` component first checks if valid, non-expired recommendations exist in the user's document.
    3.  It only calls the `getCareerRecommendations` AI flow if the cached data is more than one week old, significantly reducing redundant API calls.

### c. Data Model Refinement for Querying

-   **Challenge:** Storing all onboarding answers in a single, unstructured `onboardingData` object makes it difficult and inefficient to query users based on specific criteria (e.g., finding all "Commerce" students).
-   **Solution:** Key, high-value fields from the onboarding process are now "promoted" to top-level properties in the `UserProfile` document.
    -   `stream12th`
    -   `goal`
-   This allows for direct, efficient querying and indexing on these fields in Firestore while still preserving the complete raw data in the `onboardingData` object for the AI.
