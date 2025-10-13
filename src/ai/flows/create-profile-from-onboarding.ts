
'use server';
/**
 * @fileOverview Creates a user profile from the onboarding quiz answers.
 *
 * - createProfileFromOnboarding - A function that takes quiz answers and returns a structured user profile.
 * - CreateProfileFromOnboardingInput - The input type for the createProfileFromOnboarding function.
 * - CreateProfileFromOnboardingOutput - The return type for the createProfileFromOnboarding function.
 */

import {z} from 'zod';

const CreateProfileFromOnboardingInputSchema = z.object({
    answers: z.array(z.object({
        question: z.string(),
        answer: z.string()
    })).describe('A list of questions and answers from the multi-step onboarding journey. The answers are stringified JSON from different steps.'),
    userName: z.string().optional().describe('The user\'s name, if available from the auth provider.')
});
export type CreateProfileFromOnboardingInput = z.infer<typeof CreateProfileFromOnboardingInputSchema>;

const CreateProfileFromOnboardingOutputSchema = z.object({
  name: z.string().describe("The user's name."),
  bio: z.string().describe('A 2-3 sentence professional bio, written in the first person, based on the user\'s answers. It should be encouraging and forward-looking, synthesizing their academic history, passions, and goals.'),
  skills: z.array(z.object({
    name: z.string(),
    proficiency: z.number().min(0).max(100),
  })).describe('A list of 5-7 key skills identified from ALL of the user\'s answers (academics, higher education, feelings about subjects, achievements, and quiz responses). Assign a proficiency score (10-60) based on their inputs. A high score in a subject they disliked might translate to a skill but with lower proficiency than a subject they loved.'),
});
export type CreateProfileFromOnboardingOutput = z.infer<typeof CreateProfileFromOnboardingOutputSchema>;


export async function createProfileFromOnboarding(
  input: CreateProfileFromOnboardingInput
): Promise<CreateProfileFromOnboardingOutput> {
  // return createProfileFromOnboardingFlow(input);
  return {
    name: input.userName || 'New Explorer',
    bio:
      "A proactive and curious individual with a strong foundation in academics, eager to explore new career paths and apply my skills to real-world challenges.",
    skills: [
      { name: 'Problem Solving', proficiency: 55 },
      { name: 'Critical Thinking', proficiency: 50 },
      { name: 'Communication', proficiency: 45 },
      { name: 'Mathematics', proficiency: 40 },
      { name: 'English', proficiency: 35 },
    ],
  };
}

/*
const prompt = ai.definePrompt({
  name: 'createProfileFromOnboardingPrompt',
  input: {schema: CreateProfileFromOnboardingInputSchema},
  output: {schema: CreateProfileFromOnboardingOutputSchema},
  prompt: `You are an expert career coach and profile builder. Your task is to analyze a user's answers from a comprehensive onboarding journey and create a foundational professional profile for them.

User's Name: {{{userName}}}

Onboarding Data (provided as a series of stringified JSON objects):
{{#each answers}}
- Question: {{this.question}}
  - Answer: {{this.answer}}
{{/each}}

From this rich data, perform the following actions:
1.  **Set Name:** Use the provided user name. If none is provided, use a friendly placeholder like "New Explorer".
2.  **Generate a Bio:** Write a 2-3 sentence professional bio in the first person (e.g., "I am a..."). It should synthesize their academic history (from the 'Academics' and 'Higher Education' answers), their early achievements and passions, and their stated goals. The tone should be positive, professional, and encouraging.
3.  **Extract Skills & Estimate Proficiency:** This is the most critical step. Analyze ALL the provided data:
    - **Academics, Higher Education & Subject Deep Dive:** Look at their scores AND their "feelings". A high score in a subject they "loved" indicates a strong skill. A high score in a subject they "disliked" might still be a skill, but perhaps a less developed one (lower proficiency). A PhD in a topic indicates expertise.
    - **Early Achievements:** The "achievements" string is a goldmine for soft skills like "Leadership," "Creative Writing," or "Debate."
    - **Aptitude Quiz:** The quiz answers reveal underlying competencies. For example, a logical answer points to "Problem Solving."
    - Identify 5 to 7 distinct skills from this synthesis.
    - For each skill, assign a baseline proficiency score between 10 and 60. A score of 10 means "just starting," and 60 means "has a strong aptitude and some experience." Do not assign a score higher than 60 at this stage.

Return the result as a perfectly structured JSON object.
`,
});

const createProfileFromOnboardingFlow = ai.defineFlow(
  {
    name: 'createProfileFromOnboardingFlow',
    inputSchema: CreateProfileFromOnboardingInputSchema,
    outputSchema: CreateProfileFromOnboardingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a profile.");
    }
    return output;
  }
);
*/
// Updated
