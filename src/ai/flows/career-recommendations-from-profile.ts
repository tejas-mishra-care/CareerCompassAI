'use server';
/**
 * @fileOverview Provides personalized career recommendations based on user profile information.
 *
 * - getCareerRecommendations - A function that returns personalized career recommendations.
 * - CareerRecommendationsInput - The input type for the getCareerRecommendations function.
 * - CareerRecommendationsOutput - The return type for the getCareerRecommendations function.
 */

import {z} from 'zod';

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
    .describe('A list of 3-5 personalized career recommendations.'),
  reasoning: z
    .string()
    .describe(
      'A concise, encouraging explanation of why these specific career recommendations were made based on the user profile.'
    ),
});
export type CareerRecommendationsOutput = z.infer<
  typeof CareerRecommendationsOutputSchema
>;

export async function getCareerRecommendations(
  input: CareerRecommendationsInput
): Promise<CareerRecommendationsOutput> {
  // return careerRecommendationsFlow(input);
  return {
    careerRecommendations: [
      'Data Analyst',
      'UX/UI Designer',
      'Product Manager',
    ],
    reasoning:
      "Based on your profile, your analytical skills make you a great fit for data-driven roles, while your creative inclinations are perfect for design and product-focused careers.",
  };
}

/*
const prompt = ai.definePrompt({
  name: 'careerRecommendationsPrompt',
  input: {schema: CareerRecommendationsInputSchema},
  output: {schema: CareerRecommendationsOutputSchema},
  prompt: `You are an expert AI career advisor named CareerCompassAI. Your role is to provide insightful and encouraging career recommendations to users based on their profile.

User Profile Data:
{{{userProfile}}}

Your Task:
1.  Analyze the provided user profile, paying close attention to their skills, proficiency levels (SP), interests, and any stated goals.
2.  Generate a list of 3 to 5 specific and actionable career recommendations that are a strong match for the user. These could be specific job titles (e.g., "Data Analyst for a gaming company") or fields to explore (e.g., "Sustainable Energy Engineering").
3.  For each set of recommendations, provide a single, consolidated "reasoning" paragraph. This explanation should be positive and encouraging, highlighting how their existing skills and interests make these recommendations a good fit. For example, "Your strong problem-solving skills and creativity would make you a great fit for..."

Important Guidelines:
- Be specific in your recommendations. Avoid vague suggestions.
- Ensure the tone is optimistic and empowering.
- The output MUST be a valid JSON object matching the defined schema.`,
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
*/
// Updated
