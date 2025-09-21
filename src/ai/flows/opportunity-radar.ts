
'use server';
/**
 * @fileOverview Implements a Genkit flow that generates job and internship opportunities based on a user's profile.
 *
 * - getOpportunityRadar - A function that returns relevant job/internship listings.
 * - OpportunityRadarInput - The input type for the getOpportunityRadar function.
 * - Opportunity - The output type for a single opportunity.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OpportunityRadarInputSchema = z.object({
  userProfile: z
    .string()
    .describe('A detailed description of the user profile including their name, bio, skills with proficiency scores, and career goals.'),
});
export type OpportunityRadarInput = z.infer<typeof OpportunityRadarInputSchema>;


const OpportunitySchema = z.object({
    title: z.string().describe("The job or internship title."),
    company: z.string().describe("The name of the company."),
    location: z.string().describe("The location of the job (e.g., 'Bengaluru, IN'). Can be 'Remote'."),
    matchScore: z.number().min(0).max(100).describe("A score from 0-100 indicating how strong a match this opportunity is for the user's profile."),
    requiredSkills: z.array(z.string()).describe("A list of 3-5 key skills required for the role."),
    link: z.string().describe("A plausible but fake link to a job description page.")
});
export type Opportunity = z.infer<typeof OpportunitySchema>;

const OpportunityRadarOutputSchema = z.object({
    opportunities: z.array(OpportunitySchema).describe("A list of 3 relevant job or internship opportunities."),
});
export type OpportunityRadarOutput = z.infer<typeof OpportunityRadarOutputSchema>;


export async function getOpportunityRadar(
  input: OpportunityRadarInput
): Promise<OpportunityRadarOutput> {
  return opportunityRadarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'opportunityRadarPrompt',
  input: {schema: OpportunityRadarInputSchema},
  output: {schema: OpportunityRadarOutputSchema},
  prompt: `You are an AI-powered job matching engine for a career platform in India. Your task is to act like a job scraper and matchmaker. Based on the user's profile, you must generate 3 highly relevant, realistic-looking job or internship opportunities.

User Profile:
{{{userProfile}}}

Instructions:
1.  Analyze the user's skills, proficiency, and goals.
2.  Generate 3 distinct opportunities. These can be full-time roles for experienced users or internships for students.
3.  For each opportunity, invent a realistic company. Pick from a mix of well-known Indian startups (e.g., Zomato, Swiggy, Zerodha, CRED), large tech companies (e.g., TCS, Infosys, Wipro), and global companies with a presence in India (e.g., Google, Microsoft, Amazon).
4.  Calculate a "Match Score" (0-100) that represents how well the user's current skills align with the role's requirements. A higher score means a better fit.
5.  List 3-5 key skills required for the role. Some of these should match the user's skills.
6.  Create a plausible but fake link for each job posting.

The entire output must be a perfectly structured JSON object.
`,
});

const opportunityRadarFlow = ai.defineFlow(
  {
    name: 'opportunityRadarFlow',
    inputSchema: OpportunityRadarInputSchema,
    outputSchema: OpportunityRadarOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate opportunities.");
    }
    return output;
  }
);
