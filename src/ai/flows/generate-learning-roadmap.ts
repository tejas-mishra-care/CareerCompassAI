
'use server';
/**
 * @fileOverview Creates a personalized weekly learning roadmap.
 *
 * - generateLearningRoadmap - A function that takes user details and creates a learning schedule.
 * - GenerateLearningRoadmapInput - The input type for the function.
 * - GenerateLearningRoadmapOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLearningRoadmapInputSchema = z.object({
  name: z.string().describe("The student's name."),
  subjects: z.string().describe('The subjects the student wants to learn.'),
  goal: z.string().describe('The student\'s target goal (e.g., "Pass final exams in 3 weeks").'),
  timeAvailability: z.string().describe('When the student is available to study.'),
  learningStyle: z.string().describe('The student\'s preferred learning style (e.g., "Visual learner, prefer practice problems").'),
  weakAreas: z.string().optional().describe('Any specific weak areas the student wants to prioritize.'),
});
export type GenerateLearningRoadmapInput = z.infer<typeof GenerateLearningRoadmapInputSchema>;

const DailySessionSchema = z.object({
    time: z.string().describe("The time slot for the session (e.g., '6:00 PM - 7:00 PM')."),
    subject: z.string().describe("The subject to be studied."),
    topic: z.string().describe("The specific topic to cover."),
    activity: z.string().describe("The learning activity (e.g., 'Watch video lecture', 'Solve 10 practice problems')."),
    justification: z.string().describe("A brief reason why this session is structured this way (e.g., 'Reviewing a weak area first')."),
});

const WeeklyScheduleDaySchema = z.object({
    day: z.string().describe("The day of the week (e.g., 'Monday')."),
    sessions: z.array(DailySessionSchema).describe("A list of learning sessions for the day."),
});

const GenerateLearningRoadmapOutputSchema = z.object({
  roadmapTitle: z.string().describe("A catchy title for the learning roadmap."),
  introduction: z.string().describe("A personalized, encouraging introduction for the student, addressing them by name."),
  reasoning: z.string().describe("The overall strategy and reasoning behind the schedule's structure."),
  weeklySchedule: z.array(WeeklyScheduleDaySchema).describe('A 7-day personalized learning schedule.'),
});
export type GenerateLearningRoadmapOutput = z.infer<typeof GenerateLearningRoadmapOutputSchema>;


export async function generateLearningRoadmap(
  input: GenerateLearningRoadmapInput
): Promise<GenerateLearningRoadmapOutput> {
  return generateLearningRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningRoadmapPrompt',
  input: {schema: GenerateLearningRoadmapInputSchema},
  output: {schema: GenerateLearningRoadmapOutputSchema},
  prompt: `You are an expert academic and productivity coach named 'LearnAI'. Your goal is to create a personalized, effective, and balanced learning roadmap for a student. The roadmap should be structured, detailed, and include justifications for your choices, catering to the student's learning style.

Please generate a 7-day personalized learning roadmap based on the following details:
- Student Name: {{{name}}}
- Subjects: {{{subjects}}}
- Target Goal: {{{goal}}}
- Time Availability: {{{timeAvailability}}}
- Learning Style: {{{learningStyle}}}
- Weak Areas to Prioritize: {{{weakAreas}}}

Instructions:
1.  **Create a Title and Intro**: Craft a motivating title and a personalized introduction for {name}.
2.  **Define the Strategy**: Write a 'reasoning' section explaining the overall strategy. Mention how you're prioritizing weak areas, balancing subjects, and incorporating the student's learning style.
3.  **Build a 7-Day Schedule**: Create a 'weeklySchedule' for a full 7 days.
4.  **Structure Daily Sessions**: For each day, create an array of 'sessions'. Each session must have a 'time' slot, 'subject', 'topic', 'activity' (be specific!), and a 'justification' for that activity.
5.  **Be Realistic**: Use the 'timeAvailability' to create a realistic schedule. Include short breaks or lighter activities. If the availability for a day is none, reflect that with fewer or no sessions.
6.  **Prioritize Weaknesses**: Make sure to schedule more time or focused activities for the specified 'weakAreas' early in the week.

The output must be a perfectly structured JSON object.
`,
});

const generateLearningRoadmapFlow = ai.defineFlow(
  {
    name: 'generateLearningRoadmapFlow',
    inputSchema: GenerateLearningRoadmapInputSchema,
    outputSchema: GenerateLearningRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a learning roadmap.");
    }
    return output;
  }
);
