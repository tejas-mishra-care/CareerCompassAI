// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Implements a Genkit flow to provide personalized skill recommendations based on user profile and career interests.
 *
 * - getPersonalizedSkillRecommendations - A function that returns personalized skill recommendations.
 * - PersonalizedSkillRecommendationsInput - The input type for the getPersonalizedSkillRecommendations function.
 * - PersonalizedSkillRecommendationsOutput - The return type for the getPersonalizedSkillRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSkillRecommendationsInputSchema = z.object({
  userProfile: z
    .string()
    .describe(
      'A detailed description of the user profile including skills, experience, education, and interests.'
    ),
  careerInterests: z
    .string()
    .describe('A description of the user\'s career interests and goals.'),
});
export type PersonalizedSkillRecommendationsInput = z.infer<
  typeof PersonalizedSkillRecommendationsInputSchema
>;

const PersonalizedSkillRecommendationsOutputSchema = z.object({
  skillRecommendations: z
    .array(z.string())
    .describe('A list of personalized skill recommendations.'),
  reasoning: z
    .string()
    .describe(
      'Explanation of why these skill recommendations were made based on the user profile and career interests.'
    ),
});
export type PersonalizedSkillRecommendationsOutput = z.infer<
  typeof PersonalizedSkillRecommendationsOutputSchema
>;

export async function getPersonalizedSkillRecommendations(
  input: PersonalizedSkillRecommendationsInput
): Promise<PersonalizedSkillRecommendationsOutput> {
  return personalizedSkillRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSkillRecommendationsPrompt',
  input: {schema: PersonalizedSkillRecommendationsInputSchema},
  output: {schema: PersonalizedSkillRecommendationsOutputSchema},
  prompt: `You are an AI career advisor. Provide personalized skill recommendations based on the user profile and career interests provided.\n\nUser Profile: {{{userProfile}}}\nCareer Interests: {{{careerInterests}}}\n\nConsider the user's skills, experience, education, interests, and career goals to suggest relevant skills to learn.\nExplain your reasoning for each recommendation.\n\nFormat your response as a JSON object with \"skillRecommendations\" (an array of skill suggestions) and \"reasoning\" (the explanation for each suggestion).`,
});

const personalizedSkillRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedSkillRecommendationsFlow',
    inputSchema: PersonalizedSkillRecommendationsInputSchema,
    outputSchema: PersonalizedSkillRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

