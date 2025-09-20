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
      type: z.enum(['career', 'skill', 'course']).describe('The type of the result (career, skill, or course).'),
      link: z.string().optional().describe('A link to more information about the result.'),
      relevanceScore: z.number().optional().describe('A score from 0 to 100 indicating the relevance of the result to the user profile (higher is better).'),
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
  prompt: `You are an AI search assistant for a career development platform. Your task is to find relevant careers, skills, and courses based on a user's query and their profile.

User Query: {{{query}}}
{{#if userProfile}}
User Profile: {{{userProfile}}}
{{/if}}

Return a diverse list of results as a JSON array. Each result must include:
- A title.
- A brief description.
- A type: must be one of 'career', 'skill', or 'course'.
- A link to more information, if a relevant one exists.
- A relevanceScore (0-100) indicating how well the result matches the user's profile and query. A score of 100 is a perfect match. If no user profile is provided, base the score on the query alone.
`,
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
