<<<<<<< HEAD
# CareerCompassAI

CareerCompassAI is a sophisticated, AI-powered career navigation platform designed to help users discover their skills, explore potential career paths, and build a concrete plan to achieve their goals. It acts as a personal AI navigator, transforming a user's academic and personal history into a "Living CV" that powers personalized recommendations and opportunities.

## Core Technologies

This project is built on a modern, robust, and scalable tech stack:

-   **Frontend**: [Next.js](https://nextjs.org/) with the App Router, [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/).
-   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/) for beautifully designed, accessible, and customizable components.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
-   **AI/Generative AI**: [Google's Genkit](https://firebase.google.com/docs/genkit) framework, utilizing the Gemini family of models for all generative features.
-   **Backend & Database**: [Firebase](https://firebase.google.com/) for user authentication (Firebase Auth) and data persistence (Cloud Firestore).
-   **Charts & Visualizations**: [Recharts](https://recharts.org/) for displaying skill data.
-   **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for robust form validation.

## Getting Started

To run the application locally, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    This project uses Firebase. Your `src/lib/firebase.ts` file is already configured with the necessary API keys to connect to the backend database. No further action is needed for the frontend to connect to Firebase.

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

---

## Application Features: A Deep Dive

The application is structured into several key pages and features, each designed to guide the user through their career discovery journey.

### 1. Landing Page (`/`)

The first point of contact for new users, designed to be visually engaging and informative.

-   **Features**:
    -   **Full-Width Image Carousel**: A captivating, auto-playing slideshow of images that sets the theme of ambition and technology. The images are displayed in their original aspect ratio without cropping.
    -   **Concise Messaging**: A clear headline ("Unlock Your Future Career.") and sub-headline explain the app's value proposition.
    -   **Clear Navigation**: The header contains "Sign In" and "Get Started" buttons, both leading to the unified login/signup page.

### 2. Authentication (`/login`)

A seamless and secure entry point for both new and returning users.

-   **Features**:
    -   **Unified Auth Form**: A single form handles both user registration (`Sign Up`) and `Sign In`.
    -   **Dynamic Slideshow**: On desktop, the left side features a full-screen, auto-playing image carousel, providing a dynamic and professional backdrop. This is implemented as a client-side component to prevent server-rendering conflicts.
    -   **Firebase Auth Integration**: Securely handles user creation and sign-in using Firebase's email/password authentication.
    -   **Robust Error Handling**: Provides clear, user-friendly feedback for common errors like "email already in use" or "invalid credentials".

### 3. The Onboarding Journey (`/profile` for new users)

This is the core data-gathering process. It's a multi-step, conversational form designed to feel less like a survey and more like a guided discovery.

-   **Purpose**: To collect the necessary data points for the AI to build a rich, foundational user profile.
-   **Steps**:
    1.  **Academic History**: Collects details about the user's 10th, 12th/Diploma, and any higher education.
    2.  **Subject-Level Deep Dive**: Asks for the user's score *and* their feelings (`loved`, `okay`, `disliked`) about key subjects. This helps the AI weigh technical ability against passion.
    3.  **Aptitude Quiz ("Profile Scanner")**: A series of situational questions to identify soft skills and problem-solving approaches (e.g., analytical vs. creative).
    4.  **Goal Definition**: The final step asks the user to define their current primary goal (e.g., "Find a dream career", "Earn well", "Just exploring").

### 4. AI-Powered Profile Creation (Backend Flow)

Once the onboarding is complete, the app triggers a Genkit flow (`create-profile-from-onboarding`) to process the data.

-   **How it Works**:
    -   The raw JSON data from the onboarding form is sent to a Gemini-powered Genkit flow.
    -   The AI is prompted to analyze all answers—academic scores, subject feelings, quiz responses, and early achievements.
    -   **Outputs**: It generates a structured JSON object containing:
        -   `name`: The user's name.
        -   `bio`: A 2-3 sentence professional bio written in the first person.
        -   `skills`: An array of 5-7 key skills extracted from the data, each with a calculated proficiency score (from 10-60) based on a weighted analysis of the user's inputs.

-   **Profile Processor (`/dashboard` intermediate state)**: Users see a "Calibrating Your Compass" screen while this flow runs, providing a smooth transition.

### 5. The Dashboard (`/dashboard`)

The user's central hub, presenting the most relevant, personalized information at a glance.

-   **Welcome Card**: For new users who haven't started onboarding, this card prompts them to begin their profile journey.
-   **Skill Dashboard**: A snapshot of the user's top skills, showing their proficiency levels with progress bars for quick visual assessment.
-   **Recommendations**:
    -   **AI-Powered**: Uses a Genkit flow (`getCareerRecommendations`) that analyzes the user's profile to suggest 3-5 top career paths.
    -   **"Why These?"**: Provides a concise, encouraging explanation for its recommendations, linking them back to the user's skills and interests.
-   **Opportunity Radar**:
    -   **Proactive Job Matching**: A Genkit flow (`getOpportunityRadar`) simulates a job scraper, generating 3 realistic job or internship opportunities based on the user's profile.
    -   **Match Score**: Each opportunity includes a "Match Score" (0-100) to indicate its relevance.
-   **My Active Pathways**: Displays the user's ongoing learning pathways, showing their progress at a glance.

### 6. My Profile & My Skills (`/profile`, `/my-skills`)

These pages allow users to view their complete "Living CV".

-   **User Profile Card**: Shows the user's avatar, name, and AI-generated bio. Includes an "Edit Profile" feature.
-   **Detailed Skill Breakdown**: A full-page, tabular view of every skill the user has acquired, their proficiency tier (e.g., Novice, Advanced), and their exact Skill Point (SP) value.
-   **Education History**: A chronological display of the user's academic journey.
-   **Profile Editing**: The "Edit Profile" dialog allows users to change their display name and upload a new profile picture to Firebase Storage.

### 7. Learning Pathways (`/pathways`)

An AI tool that empowers users to create their own learning plans.

-   **Features**:
    -   **AI Pathway Generator**: Users can input any topic (e.g., "Become a UX Designer").
    -   **Genkit Flow**: A chatbot flow (`exploreCareersWithChatbot`) is prompted to generate a structured, 5-step learning plan.
    -   **Pathway Activation**: Users can click "Start Pathway" to add the generated plan to their "Active Pathways" on the dashboard.
    -   **Progress Tracking**: On the pathway detail page (`/pathways/[pathwayId]`), users can check off steps, which automatically increases their proficiency in related skills.

### 8. Experiential Library & Simulations (`/simulations`)

A place for users to test-drive careers in interactive, real-world scenarios.

-   **Features**:
    -   **Simulation Hub**: Displays available simulations as cards, showing the title, description, skills involved, and SP yield.
    -   **Mock Interview (`/simulations/mock-interview`)**:
        -   **AI Question Generation**: The user inputs a job role, and a Genkit flow (`generateInterviewQuestions`) creates a mix of relevant behavioral and technical questions.
        -   **AI Feedback**: After the user submits an answer, another Genkit flow (`getInterviewFeedback`) provides constructive, actionable feedback on their performance.

### 9. Search & Explore (`/search`, `/explore`)

AI-driven tools for discovery.

-   **Explorer Hub (Unified Search)**: A powerful search bar that uses a Genkit flow (`aiSearchAndDiscovery`) to find relevant careers, skills, and courses based on a user's query and their profile context. Results are sorted by a relevance score.
-   **Career Explorer (Chatbot)**: A conversational AI chatbot (`exploreCareersWithChatbot`) where users can ask open-ended questions about careers, industries, and skills, receiving personalized answers based on their profile.

### 10. Community & Connect (`/community`, `/connect`)

Forward-looking pages designed for future social and mentorship features.

-   **Features (Currently "Coming Soon")**:
    -   **Peer Groups**: Join groups based on interests.
    -   **Q&A Forums**: Ask questions and get answers from the community.
    -   **Counselor Connect**: Grant verified counselors access to the dashboard.
    -   **Parent & Guardian Portal**: Generate a secure, read-only link to share progress with family.
    -   **Privacy-First**: The UI emphasizes that no data is shared without explicit user consent.
=======

>>>>>>> 245669c (Update README.md)

<!-- Updated -->