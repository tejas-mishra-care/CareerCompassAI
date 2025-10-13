'use server';
/**
 * @fileOverview Implements the AI-enhanced search for careers flow.
 *
 * - aiSearchForCareers - A function that takes a query and returns a list of matching careers.
 * - AiSearchForCareersInput - The input type for the aiSearchForCareers function.
 * - AiSearchForCareersOutput - The return type for the aiSearchForCareers function.
 */

import {z} from 'zod';

const AiSearchForCareersInputSchema = z.object({
  query: z.string().describe('The search query for careers.'),
  userSkills: z
    .array(z.string())
    .optional()
    .describe('A list of the user skills.'),
  userInterests: z
    .string()
    .optional()
    .describe('A description of user interests.'),
});
export type AiSearchForCareersInput = z.infer<typeof AiSearchForCareersInputSchema>;

const AiSearchForCareersOutputSchema = z.object({
  careers: z.array(
    z.object({
      title: z.string().describe('The title of the career.'),
      description: z.string().describe('A brief description of the career.'),
      requiredSkills: z.array(z.string()).describe('The required skills for the career.'),
      link: z.string().optional().describe('A link to a job board for the career.'),
    })
  ),
});
export type AiSearchForCareersOutput = z.infer<typeof AiSearchForCareersOutputSchema>;

export async function aiSearchForCareers(input: AiSearchForCareersInput): Promise<AiSearchForCareersOutput> {
  // return aiSearchForCareersFlow(input);
  return {
    careers: [
      {
        title: 'Frontend Developer',
        description: 'Build user interfaces for websites and web applications.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
        link: '#',
      },
      {
        title: 'Backend Developer',
        description: 'Work on server-side logic, databases, and APIs.',
        requiredSkills: ['Node.js', 'Python', 'SQL', 'REST APIs'],
        link: '#',
      },
    ],
  };
}

/*
const prompt = ai.definePrompt({
  name: 'aiSearchForCareersPrompt',
  input: {schema: AiSearchForCareersInputSchema},
  output: {schema: AiSearchForCareersOutputSchema},
  prompt: `You are a career expert. Using the user's query, skills, and interests, find a list of careers that match.

User Query: {{{query}}}
{{#if userSkills}}
User Skills:
{{#each userSkills}}
- {{{this}}}
{{/each}}
{{/if}}
{{#if userInterests}}
User Interests: {{{userInterests}}}
{{/if}}

Return the results as a JSON array of careers.
Each career should have a title, description, requiredSkills, and a link to a job board if available.
`,
});

const aiSearchForCareersFlow = ai.defineFlow(
  {
    name: 'aiSearchForCareersFlow',
    inputSchema: AiSearchForCareersInputSchema,
    outputSchema: AiSearchForCareersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
*/
// Updated
