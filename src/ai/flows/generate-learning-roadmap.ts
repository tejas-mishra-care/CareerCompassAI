'use server';
/**
 * @fileOverview Implements the AI-powered personalized learning roadmap generator.
 */
import { z } from 'zod';

// Define the schema for the inputs from the user form
export const GenerateLearningRoadmapInputSchema = z.object({
  name: z.string().describe('The name of the student.'),
  subjects: z.string().describe('A comma-separated list of subjects the student needs to study.'),
  goal: z.string().describe('The student\'s primary goal (e.g., "Ace the final exams in 3 weeks", "Learn React for a new job").'),
  timeAvailability: z.string().describe('A description of when the student is available to study (e.g., "Weekdays from 6 PM to 9 PM, all day on weekends").'),
  learningStyle: z.string().describe('The student\'s preferred learning style (e.g., "visual learner, enjoys video tutorials", "prefers hands-on projects").'),
  weakAreas: z.string().optional().describe('A comma-separated list of topics or subjects the student finds difficult.'),
});
export type GenerateLearningRoadmapInput = z.infer<typeof GenerateLearningRoadmapInputSchema>;

// Define the schema for the output we expect from the AI
const StudySessionSchema = z.object({
  time: z.string().describe("The time for the study session (e.g., '6:00 PM - 7:30 PM')."),
  subject: z.string().describe("The main subject for the session."),
  topic: z.string().describe("The specific topic to be covered."),
  activity: z.string().describe("The learning activity (e.g., 'Watch video tutorials on topic X', 'Complete 20 practice problems')."),
  justification: z.string().describe("A brief reason for why this activity is scheduled at this time (e.g., 'Tackle harder subjects when you're fresh')."),
});

const DailyPlanSchema = z.object({
  day: z.string().describe("The day of the week (e.g., 'Monday')."),
  sessions: z.array(StudySessionSchema).describe("An array of study sessions for the day."),
});

export const GenerateLearningRoadmapOutputSchema = z.object({
  roadmapTitle: z.string().describe("A compelling title for the learning roadmap (e.g., 'Your Personalized 3-Week Exam Success Plan')."),
  introduction: z.string().describe("A brief, personalized introduction paragraph addressing the student by name and acknowledging their goal."),
  reasoning: z.string().describe("An explanation of the methodology behind the schedule, mentioning how it incorporates their learning style, weak areas, and the importance of breaks."),
  weeklySchedule: z.array(DailyPlanSchema).describe("A 7-day schedule outlining each day's study plan."),
});
export type GenerateLearningRoadmapOutput = z.infer<typeof GenerateLearningRoadmapOutputSchema>;

// Mock function to return hardcoded data
export async function generateLearningRoadmap(input: GenerateLearningRoadmapInput): Promise<GenerateLearningRoadmapOutput> {
  // In a real scenario, this is where you would call the Genkit AI flow.
  // For the hackathon, we'll return a structured, hardcoded response.
  
  return {
    roadmapTitle: `Your Personalized Roadmap to Master: ${input.subjects}`,
    introduction: `Hello, ${input.name}! Here is your personalized learning plan designed to help you achieve your goal: "${input.goal}". This roadmap is tailored to your unique needs and learning style.`,
    reasoning: `This schedule is designed to maximize your focus by tackling challenging subjects earlier in your sessions. We've incorporated breaks to prevent burnout and allocated specific time to review your weak areas, like ${input.weakAreas}. The activities align with your preference for ${input.learningStyle}.`,
    weeklySchedule: [
      {
        day: 'Monday',
        sessions: [
          {
            time: '6:00 PM - 7:30 PM',
            subject: input.subjects.split(',')[0] || 'First Subject',
            topic: 'Core Concepts Review',
            activity: 'Review class notes and watch introductory videos.',
            justification: 'Start the week by reinforcing fundamentals to build confidence.',
          },
          {
            time: '7:45 PM - 9:00 PM',
            subject: input.weakAreas?.split(',')[0] || 'Weak Area 1',
            topic: 'Focused Practice',
            activity: 'Complete 10 easy practice problems on this topic.',
            justification: 'Address weak areas with low-pressure exercises early in the week.',
          },
        ],
      },
      {
        day: 'Tuesday',
        sessions: [
          {
            time: '6:00 PM - 7:30 PM',
            subject: input.subjects.split(',')[1] || 'Second Subject',
            topic: 'Advanced Topic Introduction',
            activity: 'Read the next chapter and try to summarize it in your own words.',
            justification: 'Introduce new material after a day of review.',
          },
          {
            time: '7:45 PM - 9:00 PM',
            subject: input.subjects.split(',')[0] || 'First Subject',
            topic: 'Practical Application',
            activity: 'Find a real-world example or project related to what you learned Monday.',
            justification: 'Connect theory to practice to improve retention.',
          },
        ],
      },
      {
        day: 'Wednesday',
        sessions: [
            {
                time: '6:00 PM - 7:30 PM',
                subject: 'Review Day',
                topic: 'Consolidation of Week\'s Learning',
                activity: 'Create flashcards or a mind map of all topics covered so far.',
                justification: 'Mid-week review is crucial for long-term memory.',
            },
            {
                time: '7:30 PM - 9:00 PM',
                subject: 'Break & Relax',
                topic: 'Mental Recharge',
                activity: 'Engage in a hobby, watch a show, or do something you enjoy.',
                justification: 'Scheduled downtime is essential to prevent burnout and maintain motivation.',
            }
        ],
      },
      {
        day: 'Thursday',
        sessions: [
            {
                time: '6:00 PM - 7:30 PM',
                subject: input.weakAreas?.split(',')[0] || 'Weak Area 1',
                topic: 'Deep Dive',
                activity: 'Watch an in-depth tutorial and attempt 5 challenging problems.',
                justification: 'Revisit a weak area with more confidence after a few days.',
            },
            {
                time: '7:45 PM - 9:00 PM',
                subject: input.subjects.split(',')[1] || 'Second Subject',
                topic: 'Practice Problems',
                activity: 'Complete a full exercise set from your textbook or online course.',
                justification: 'Solidify understanding through repetition.',
            }
        ],
      },
      {
        day: 'Friday',
        sessions: [
            {
                time: '6:00 PM - 7:30 PM',
                subject: 'Mock Test',
                topic: 'Weekly Self-Assessment',
                activity: 'Take a practice quiz covering all topics from this week.',
                justification: 'Simulate exam conditions to identify remaining gaps.',
            },
        ],
      },
      { day: 'Saturday', sessions: [] },
      { day: 'Sunday', sessions: [] },
    ],
  };
}
