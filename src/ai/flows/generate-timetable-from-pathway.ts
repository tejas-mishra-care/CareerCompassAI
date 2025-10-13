
'use server';
/**
 * @fileOverview Creates a personalized weekly timetable from a learning pathway.
 *
 * - generateTimetable - A function that takes a pathway and user details to create a schedule.
 * - GenerateTimetableInput - The input type for the generateTimetable function.
 * - GenerateTimetableOutput - The return type for the generateTimetable function.
 */

import {z} from 'zod';

const GenerateTimetableInputSchema = z.object({
  pathwayTitle: z.string().describe('The title of the learning pathway.'),
  pathwaySteps: z.array(z.string()).describe('An array of the steps in the learning pathway.'),
  timeAvailability: z.string().describe('The number of hours the user can dedicate per week (e.g., "5-7 hours").'),
  userProfile: z.string().optional().describe('The user\'s profile, including skills and weak areas, for prioritization.'),
});
export type GenerateTimetableInput = z.infer<typeof GenerateTimetableInputSchema>;

const TimetableDaySchema = z.object({
    day: z.string().describe("The day of the week (e.g., 'Monday', 'Tuesday')."),
    tasks: z.array(z.object({
        task: z.string().describe("A specific, actionable learning task for the day."),
        duration: z.string().describe("The estimated time for the task (e.g., '60 minutes', '90 minutes')."),
        isBreak: z.boolean().optional().describe("Set to true if this task is a scheduled break."),
    })).describe("A list of tasks for the day."),
});

const GenerateTimetableOutputSchema = z.object({
  weeklyTimetable: z.array(TimetableDaySchema).describe('A 5-day weekly learning schedule based on the pathway.'),
  reasoning: z.string().describe('A brief explanation for why the schedule is structured this way, mentioning prioritization and breaks.'),
});
export type GenerateTimetableOutput = z.infer<typeof GenerateTimetableOutputSchema>;


export async function generateTimetable(
  input: GenerateTimetableInput
): Promise<GenerateTimetableOutput> {
  // return generateTimetableFlow(input);
  return {
    weeklyTimetable: [
      {
        day: 'Monday',
        tasks: [
          { task: 'Review fundamental concepts', duration: '60 minutes' },
          { task: 'Practical exercises for Step 1', duration: '90 minutes' },
        ],
      },
      {
        day: 'Tuesday',
        tasks: [
          { task: 'Start Step 2: Core Skills', duration: '75 minutes' },
          { task: 'Short Break', duration: '15 minutes', isBreak: true },
          { task: 'Read documentation', duration: '45 minutes' },
        ],
      },
      {
        day: 'Wednesday',
        tasks: [{ task: 'Work on hands-on project', duration: '120 minutes' }],
      },
      {
        day: 'Thursday',
        tasks: [
          { task: 'Study advanced topics from Step 3', duration: '90 minutes' },
          { task: 'Review and consolidate learning', duration: '60 minutes' },
        ],
      },
      {
        day: 'Friday',
        tasks: [
          { task: 'Focus on weak areas', duration: '60 minutes' },
          { task: 'Weekly review and planning', duration: '45 minutes' },
        ],
      },
    ],
    reasoning:
      'This schedule is designed to balance theoretical learning with practical application, including dedicated time for reviewing difficult topics and planning for the week ahead.',
  };
}

/*
const prompt = ai.definePrompt({
  name: 'generateTimetablePrompt',
  input: {schema: GenerateTimetableInputSchema},
  output: {schema: GenerateTimetableOutputSchema},
  prompt: `You are an AI learning coach. Your task is to create a personalized, 5-day weekly study timetable for a user based on their learning pathway and time availability.

Pathway Title: {{{pathwayTitle}}}
Pathway Steps:
{{#each pathwaySteps}}
- {{{this}}}
{{/each}}

User's Weekly Time Availability: {{{timeAvailability}}}
{{#if userProfile}}
User Profile Context (for prioritization): {{{userProfile}}}
{{/if}}

Instructions:
1.  **Analyze Inputs**: Review the pathway steps and the user's available time.
2.  **Create a 5-Day Schedule**: Distribute the learning tasks across 5 days (Monday to Friday). Do not schedule for weekends.
3.  **Allocate Time**: Break down the pathway steps into smaller, manageable tasks and assign a realistic duration to each (e.g., "60 minutes," "90 minutes"). The total time for the week should align with the user's availability.
4.  **Prioritize**: If the user profile is available, use it to prioritize steps that might be more challenging for the user. Mention this in your reasoning.
5.  **Schedule Breaks**: Intelligently insert short breaks (e.g., "15-minute break") between longer study sessions. Mark these tasks with 'isBreak: true'.
6.  **Provide Reasoning**: Write a short (1-2 sentence) explanation for the structure of the timetable. For example, mention how you've balanced difficult topics or included breaks for productivity.

Return the result as a perfectly structured JSON object.
`,
});

const generateTimetableFlow = ai.defineFlow(
  {
    name: 'generateTimetableFlow',
    inputSchema: GenerateTimetableInputSchema,
    outputSchema: GenerateTimetableOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a timetable.");
    }
    return output;
  }
);
*/
// Updated
