
# CareerCompassAI Application Documentation

This document provides a technical overview of the CareerCompassAI application, detailing its architecture, data flow, component structure, and AI integration.

## 1. Core Technologies

- **Framework:** Next.js with App Router
- **UI:** React, Tailwind CSS, ShadCN UI Components
- **State Management:** React Context API (`useUserProfile` hook with real-time Firestore listener)
- **Database:** Google Firestore
- **Authentication:** Firebase Authentication (Email/Password & Google)
- **AI/Generative:** Genkit with Google's Gemini models

---

## 2. User Authentication and Profile Flow

The entire authenticated experience is managed by the `UserProfileProvider` located in `src/hooks/use-user-profile.tsx`.

### Flow:

1.  **Firebase Auth State:** The provider listens for changes in Firebase's authentication state (`onAuthStateChanged`).
2.  **Real-time Profile Sync:** When a user is logged in, the provider establishes a real-time listener (`onSnapshot`) to their user document in Firestore. Any changes to the profile in the database are instantly reflected in the application's state, triggering UI updates automatically.
3.  **New User Creation:** When a user signs in for the first time (e.g., via Google), a new document is created for them in the `users` collection in Firestore, using their Firebase UID as the document ID. A default `UserProfile` object is created with `onboardingCompleted` set to `false`.
4.  **Navigation and Redirection:** The `useUserProfile` hook also centralizes navigation logic. It ensures:
    - Unauthenticated users are restricted to public pages (`/` and `/login`).
    - Authenticated users who have not completed onboarding are forcefully redirected to the `/profile` page to begin the process.
    - Authenticated users who land on public pages are automatically redirected to their `/dashboard`.

---

## 3. Onboarding Journey (Two-Part Flow)

The onboarding process is now a robust, two-part system designed to collect initial data and then process it without blocking the user.

### Part 1: Data Collection (`/profile` route)

This part is handled by the `OnboardingStepper` component (`src/components/onboarding/onboarding-stepper.tsx`), which is rendered on the `/profile` page if `onboardingCompleted` is `false`.

-   **Multi-Step Form:** It's a single, unified form broken into four visual steps to collect:
    1.  **Academic & Career History:** 10th/12th details and a dynamic section for higher education (Bachelors, Masters, PhD).
    2.  **Subject Deep Dive:** Gathers scores and user feelings (`loved`, `okay`, `disliked`) for subjects relevant to their academic stream.
    3.  **Aptitude Quiz:** A series of multiple-choice questions to gauge personality and problem-solving styles.
    4.  **Goal Definition:** Asks the user to select their primary current goal.

-   **"Finish" Button Logic:**
    1.  When clicked, the form is submitted, triggering the `handleFinish` function.
    2.  This function performs **one simple, reliable task**: it saves the entire collected form data into a single `onboardingData` object within the user's document in Firestore.
    3.  Simultaneously, it sets the `onboardingCompleted` flag to `true` in the same document.
    4.  The user is then **immediately redirected to `/dashboard`**.

### Part 2: AI Profile Processing (`/dashboard` route)

This part is handled by the new `ProfileProcessor` component (`src/components/dashboard/profile-processor.tsx`).

-   **Conditional Rendering:** This component is rendered on the dashboard **only** when `onboardingCompleted` is `true` but the main profile (bio, skills) has not yet been generated.
-   **Asynchronous AI Call:** When it mounts, it performs the following actions:
    1.  Displays a loading state to the user (e.g., "Calibrating your compass...").
    2.  Reads the raw `onboardingData` object from the user's Firestore document.
    3.  Packages this data and sends it to the `createProfileFromOnboarding` Genkit AI flow.
    4.  The AI flow analyzes all the data and returns a structured object containing a generated `bio` and a list of `skills` with proficiency scores.
    5.  The component then updates the user's profile in Firestore with this new `bio` and `skills` data.
-   **Automatic UI Update:** Because the `useUserProfile` hook uses a real-time listener, the moment the profile is updated in Firestore, the dashboard page automatically receives the new data, hides the `ProfileProcessor`, and displays the main dashboard widgets (`SkillDashboard`, `Recommendations`, etc.).

---

## 4. Key AI Flows (`src/ai/flows/`)

-   **`create-profile-from-onboarding.ts`:** The most critical flow. Takes the raw JSON of a user's onboarding answers (including higher education) and returns a structured profile with a `bio` and `skills`.
-   **`career-recommendations-from-profile.ts`:** Reads a user's generated profile (bio and skills) and suggests 3-5 relevant career paths. This powers the "Recommended For You" card.
-   **`explore-careers-with-chatbot.ts`:** A general-purpose chatbot for answering career questions. It can optionally take the user's profile for more personalized answers. Powers the `/explore` page.
-   **`ai-search-and-discovery.ts`:** Powers the `/search` page. Takes a search query and user profile to return a mixed list of relevant careers, skills, and courses.

---

## 5. Data Model

The primary data model is the `UserProfile` interface defined in `src/lib/types.ts`.

```typescript
export interface UserProfile {
  name: string;
  bio: string;
  skills: Skill[];
  activePathways?: Pathway[];

  // Onboarding-specific fields
  onboardingCompleted?: boolean;
  onboardingData?: any; // Stores the raw output from the stepper form
}

export interface Skill {
  name: string;
  proficiency: number; // 0-100
}
```
