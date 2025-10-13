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
  
  // Mock logic to make recommendations feel more personalized
  const recommendations = ['Data Analyst', 'UX/UI Designer', 'Product Manager'];
  if (input.userProfile.toLowerCase().includes('computer science')) {
    recommendations.unshift('Software Engineer');
  }
  if (input.userProfile.toLowerCase().includes('art') || input.userProfile.toLowerCase().includes('design')) {
    recommendations.unshift('Graphic Designer');
  }


  return {
    careerRecommendations: recommendations.slice(0, 3),
    reasoning:
      "Based on your unique profile, your analytical and problem-solving skills make you a great candidate for data-driven roles. We've also noticed your creative inclinations, which align perfectly with design and product-focused careers. This blend of talents opens up exciting and diverse opportunities for you.",
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
