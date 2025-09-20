'use server';
/**
 * @fileOverview Provides personalized career recommendations based on user profile information.
 *
 * - getCareerRecommendations - A function that returns personalized career recommendations.
 * - CareerRecommendationsInput - The input type for the getCareerRecommendations function.
 * - CareerRecommendationsOutput - The return type for the getCareerRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerRecommendationsInputSchema = z.object({
  userProfile: z
    .string()
    .describe(
      'A detailed description of the user profile including skills, experience, education, and interests.'
    ),
});
export type CareerRecommendationsInput = z.infer<
  typeof CareerRecommendationsInputSchema
>;

const CareerRecommendationsOutputSchema = z.object({
  careerRecommendations: z
    .array(z.string())
    .describe('A list of personalized career recommendations.'),
  reasoning: z
    .string()
    .describe(
      'Explanation of why these career recommendations were made based on the user profile.'
    ),
});
export type CareerRecommendationsOutput = z.infer<
  typeof CareerRecommendationsOutputSchema
>;

export async function getCareerRecommendations(
  input: CareerRecommendationsInput
): Promise<CareerRecommendationsOutput> {
  return careerRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerRecommendationsPrompt',
  input: {schema: CareerRecommendationsInputSchema},
  output: {schema: CareerRecommendationsOutputSchema},
  prompt: `You are an AI career advisor. Provide personalized career recommendations based on the user profile provided.

User Profile: {{{userProfile}}}

Consider the user's skills, experience, education, and interests to suggest relevant career paths.
Explain your reasoning for each recommendation.

Format your response as a JSON object with "careerRecommendations" (an array of career suggestions) and "reasoning" (the explanation for each suggestion).`,
});

const careerRecommendationsFlow = ai.defineFlow(
  {
    name: 'careerRecommendationsFlow',
    inputSchema: CareerRecommendationsInputSchema,
    outputSchema: CareerRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
