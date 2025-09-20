'use server';

/**
 * @fileOverview Implements a Genkit flow that allows users to ask questions about different career paths.
 *
 * - exploreCareerPaths - A function that handles the career path exploration process.
 * - ExploreCareerPathsInput - The input type for the exploreCareerPaths function.
 * - ExploreCareerPathsOutput - The return type for the exploreCareerPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExploreCareerPathsInputSchema = z.object({
  careerPathQuestion: z.string().describe('The user question about a specific career path.'),
});
export type ExploreCareerPathsInput = z.infer<typeof ExploreCareerPathsInputSchema>;

const ExploreCareerPathsOutputSchema = z.object({
  careerPathAnswer: z.string().describe('The chatbot answer to the user question about the career path, including required skills and potential job roles.'),
});
export type ExploreCareerPathsOutput = z.infer<typeof ExploreCareerPathsOutputSchema>;

export async function exploreCareerPaths(
  input: ExploreCareerPathsInput
): Promise<ExploreCareerPathsOutput> {
  return exploreCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'exploreCareerPathsPrompt',
  input: {schema: ExploreCareerPathsInputSchema},
  output: {schema: ExploreCareerPathsOutputSchema},
  prompt: `You are a career expert chatbot. A user will ask a question about a career path, and you should provide a helpful answer that includes the required skills and potential job roles.

Question: {{{careerPathQuestion}}}`,
});

const exploreCareerPathsFlow = ai.defineFlow(
  {
    name: 'exploreCareerPathsFlow',
    inputSchema: ExploreCareerPathsInputSchema,
    outputSchema: ExploreCareerPathsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
