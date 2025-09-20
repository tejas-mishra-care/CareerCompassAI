'use server';
/**
 * @fileOverview Implements the AI-enhanced search and discovery flow.
 *
 * - aiSearchAndDiscovery - A function that takes a query and returns a list of matching results.
 * - AiSearchAndDiscoveryInput - The input type for the aiSearchAndDiscovery function.
 * - AiSearchAndDiscoveryOutput - The return type for the aiSearchAndDiscovery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSearchAndDiscoveryInputSchema = z.object({
  query: z.string().describe('The search query for careers, skills, and courses.'),
  userProfile: z
    .string()
    .optional()
    .describe('A detailed description of the user profile including skills, experience, education, and interests.'),
});
export type AiSearchAndDiscoveryInput = z.infer<typeof AiSearchAndDiscoveryInputSchema>;

const AiSearchAndDiscoveryOutputSchema = z.object({
  results: z.array(
    z.object({
      title: z.string().describe('The title of the result.'),
      description: z.string().describe('A brief description of the result.'),
      type: z.string().describe('The type of the result (career, skill, or course).'),
      link: z.string().optional().describe('A link to more information about the result.'),
      relevanceScore: z.number().optional().describe('A score indicating the relevance of the result to the user profile.'),
    })
  ),
});
export type AiSearchAndDiscoveryOutput = z.infer<typeof AiSearchAndDiscoveryOutputSchema>;

export async function aiSearchAndDiscovery(input: AiSearchAndDiscoveryInput): Promise<AiSearchAndDiscoveryOutput> {
  return aiSearchAndDiscoveryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSearchAndDiscoveryPrompt',
  input: {schema: AiSearchAndDiscoveryInputSchema},
  output: {schema: AiSearchAndDiscoveryOutputSchema},
  prompt: `You are an AI search assistant. Using the user's query and profile, find a list of relevant careers, skills, and courses.

User Query: {{{query}}}
{{#if userProfile}}
User Profile: {{{userProfile}}}
{{/if}}

Return the results as a JSON array of results.
Each result should have a title, description, type (career, skill, or course), a link to more information if available, and a relevance score indicating how well it matches the user profile (higher is better).`,
});

const aiSearchAndDiscoveryFlow = ai.defineFlow(
  {
    name: 'aiSearchAndDiscoveryFlow',
    inputSchema: AiSearchAndDiscoveryInputSchema,
    outputSchema: AiSearchAndDiscoveryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
