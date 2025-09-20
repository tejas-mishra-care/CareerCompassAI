
# CareerCompassAI Application Documentation

This document provides a technical overview of the CareerCompassAI application, detailing its architecture, data flow, component structure, and AI integration.

## 1. Core Technologies

- **Framework:** Next.js with App Router
- **UI:** React, Tailwind CSS, ShadCN UI Components
- **State Management:** React Context API (`useUserProfile` hook)
- **Database:** Google Firestore
- **Authentication:** Firebase Authentication (Email/Password & Google)
- **AI/Generative:** Genkit with Google's Gemini models

---

## 2. User Authentication and Profile Flow

The entire authenticated experience is managed by the `UserProfileProvider` located in `src/hooks/use-user-profile.tsx`.

### Flow:

1.  **Firebase Auth State:** The provider listens for changes in Firebase's authentication state (`onAuthStateChanged`).
2.  **Login/Logout:**
    - If a user is not logged in, they are restricted to public pages (`/` and `/login`). Any attempt to access a protected page results in a redirect to `/login`.
    - Upon successful login, they are redirected to `/dashboard`.
3.  **Firestore Document:**
    - When a user signs in for the first time, a new document is created for them in the `users` collection in Firestore, using their Firebase UID as the document ID.
    - A default `UserProfile` object is created, with `onboardingCompleted` set to `false`.
    - On subsequent logins, their existing profile data is fetched from Firestore.

---

## 3. Onboarding Journey

The onboarding process is designed to collect initial data from the user to generate their foundational career profile.

### Triggering Onboarding:

- The `useUserProfile` hook contains logic that checks the `onboardingCompleted` flag from the user's profile.
- If a user is logged in but `onboardingCompleted` is `false`, they are **forcefully redirected to the `/profile` page**, which renders the `OnboardingStepper` component.

### `OnboardingStepper` Component (`src/components/onboarding/onboarding-stepper.tsx`):

This is a multi-step form designed to collect user data in four stages:

1.  **Step 1: Academic Foundation:** Collects 10th and 12th-grade scores, boards, and streams. It also asks for a free-text entry of early achievements and passions.
2.  **Step 2: Subject Deep Dive:** Dynamically generates a list of academic subjects based on the stream selected in Step 1. For each subject, it asks for the user's score and their feeling (`loved`, `okay`, `disliked`).
3.  **Step 3: Aptitude Quiz:** Presents a series of multiple-choice questions designed to reveal personality traits and problem-solving styles.
4.  **Step 4: Defining Direction:** Asks the user to select their primary current goal (e.g., "Find a dream career," "Prepare for an exam").

**Intended "Finish" Button Logic:**

This has been the primary point of failure. The intended logic is as follows:

1.  The "Finish" button is on the final step (Step 4).
2.  When clicked, the form is submitted.
3.  The `handleFinish` function is executed.
4.  This function takes all the data collected across the four steps and saves it into a single `onboardingData` object within the user's document in Firestore.
5.  Simultaneously, it sets the `onboardingCompleted` flag to `true` in the same document.
6.  The user is then immediately redirected to `/dashboard`.

---

## 4. Dashboard and AI Profile Processing

The dashboard is the central hub and is designed to be dynamic based on the user's profile state.

### `DashboardPage` Component (`src/app/(pages)/dashboard/page.tsx`):

- This page uses the `useUserProfile` hook to get the user's profile.
- It checks two conditions: `needsOnboarding` (`!onboardingCompleted`) and `needsProcessing` (`onboardingCompleted` is true, but the profile is not yet "complete," i.e., has no bio or skills).

### `ProfileProcessor` Component (`src/components/dashboard/profile-processor.tsx`):

- **This is the critical second half of the onboarding flow.**
- It is rendered on the dashboard **only** when `onboardingCompleted` is `true` but the main profile (bio, skills) has not yet been generated.
- When it mounts, it performs the following actions:
    1.  Displays a loading state to the user (e.g., "Calibrating your compass...").
    2.  Reads the raw `onboardingData` object from the user's Firestore document.
    3.  Packages this data and sends it to the `createProfileFromOnboarding` Genkit AI flow.
    4.  The AI flow analyzes the data and returns a structured object containing a generated `bio` and a list of `skills` with proficiency scores.
    5.  The component then updates the user's profile in Firestore with this new `bio` and `skills` data.
- Once the profile is updated, the `useUserProfile` hook provides the new data to the `DashboardPage`, which then automatically hides the `ProfileProcessor` and displays the main dashboard widgets (`SkillDashboard`, `Recommendations`, etc.).

---

## 5. Key AI Flows (`src/ai/flows/`)

- **`create-profile-from-onboarding.ts`:** The most critical flow. Takes the raw JSON of a user's onboarding answers and returns a structured profile with a `bio` and `skills`.
- **`career-recommendations-from-profile.ts`:** Reads a user's generated profile (bio and skills) and suggests 3-5 relevant career paths. This powers the "Recommended For You" card.
- **`explore-careers-with-chatbot.ts`:** A general-purpose chatbot for answering career questions. It can optionally take the user's profile for more personalized answers. Powers the `/explore` page.
- **`ai-search-and-discovery.ts`:** Powers the `/search` page. Takes a search query and user profile to return a mixed list of relevant careers, skills, and courses.

---

## 6. Data Model

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
