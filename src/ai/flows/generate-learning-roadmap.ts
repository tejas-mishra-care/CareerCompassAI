'use server';
/**
 * @fileOverview Implements the AI-powered personalized learning roadmap generator.
 */
import { z } from 'zod';

export const GenerateLearningRoadmapInputSchema = z.object({
  name: z.string().describe('The name of the student.'),
  subjects: z.string().describe('A comma-separated list of subjects the student needs to study.'),
  goal: z.string().describe('The student\'s primary goal (e.g., "Ace the final exams in 3 weeks", "Learn React for a new job").'),
  timeAvailability: z.string().describe('A description of when the student is available to study (e.g., "Weekdays from 6 PM to 9 PM, all day on weekends").'),
  learningStyle: z.string().describe('The student\'s preferred learning style (e.g., "visual learner, enjoys video tutorials", "prefers hands-on projects").'),
  weakAreas: z.string().optional().describe('A comma-separated list of topics or subjects the student finds difficult.'),
  completedTasks: z.string().optional().describe("A summary of tasks the user has already completed from a previous version of the plan. Use this to create a catch-up plan."),
});
export type GenerateLearningRoadmapInput = z.infer<typeof GenerateLearningRoadmapInputSchema>;

const StudySessionSchema = z.object({
  time: z.string().describe("The time for the study session (e.g., '6:00 PM - 7:30 PM')."),
  subject: z.string().describe("The main subject for the session."),
  topic: z.string().describe("The specific topic to be covered."),
  activity: z.string().describe("The learning activity (e.g., 'Watch video tutorials on topic X', 'Complete 20 practice problems')."),
  resources: z.array(z.string()).optional().describe("A list of 1-2 specific, actionable resource suggestions (e.g., 'Khan Academy', 'freeCodeCamp YouTube channel')."),
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


export async function generateLearningRoadmap(input: GenerateLearningRoadmapInput): Promise<GenerateLearningRoadmapOutput> {
  // In a real scenario, this is where you would call the Genkit AI flow.
  // For the hackathon, we'll return a structured, hardcoded response that is more detailed.
  
  const isRegeneration = !!input.completedTasks;

  return {
    roadmapTitle: isRegeneration ? `Your Refined Roadmap to Master: ${input.subjects}` : `Your Personalized Roadmap to Master: ${input.subjects}`,
    introduction: `Hello, ${input.name}! ${isRegeneration ? "Here is your updated, adaptive learning plan. I've adjusted the schedule to account for your progress and ensure you still meet your goal." : `Here is your personalized learning plan designed to help you achieve your goal: "${input.goal}". This roadmap is tailored to your unique needs and learning style.`}`,
    reasoning: `This schedule is designed to maximize your focus by tackling challenging subjects earlier in your sessions. We've incorporated breaks to prevent burnout and allocated specific time to review your weak areas, like ${input.weakAreas}. The activities align with your preference for ${input.learningStyle}, with suggested resources to get you started. ${isRegeneration ? "I've compressed the remaining topics to help you catch up." : ""}`,
    weeklySchedule: [
      {
        day: 'Monday',
        sessions: [
          {
            time: '6:00 PM - 7:30 PM',
            subject: input.subjects.split(',')[0] || 'First Subject',
            topic: 'Core Concepts Review',
            activity: 'Review class notes and watch introductory videos on the fundamental principles.',
            resources: ['Khan Academy', 'Your Textbook Chapter 1-2'],
            justification: 'Start the week by reinforcing fundamentals to build confidence.',
          },
          {
            time: '7:45 PM - 9:00 PM',
            subject: input.weakAreas?.split(',')[0] || 'Weak Area 1',
            topic: 'Focused Practice',
            activity: 'Complete 10 easy practice problems on this topic from a workbook or online quiz platform.',
            resources: ['GeeksforGeeks Practice', 'Coursera quizzes'],
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
            activity: 'Read the next chapter and try to summarize it in your own words. Use a mind-mapping tool.',
            resources: ['MindMeister (online tool)', 'Your Textbook Chapter 3'],
            justification: 'Introduce new material after a day of review.',
          },
          {
            time: '7:45 PM - 9:00 PM',
            subject: input.subjects.split(',')[0] || 'First Subject',
            topic: 'Practical Application Project',
            activity: 'Find a small, real-world project to apply what you learned on Monday. E.g., a simple calculator if learning programming.',
            resources: ['GitHub for project ideas', 'Build-your-own-X repository'],
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
                activity: 'Create flashcards for all new vocabulary and concepts covered so far this week.',
                resources: ['Anki (flashcard app)', 'Quizlet'],
                justification: 'Mid-week review is crucial for long-term memory.',
            },
            {
                time: '7:30 PM - 9:00 PM',
                subject: 'Break & Relax',
                topic: 'Mental Recharge',
                activity: 'Engage in a hobby, watch a show, or do something you enjoy. No screens related to studying.',
                resources: [],
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
                topic: 'Deep Dive Tutorial',
                activity: 'Watch an in-depth video tutorial on the topic and attempt 5 challenging problems.',
                resources: ['freeCodeCamp (YouTube)', 'The Net Ninja (YouTube)'],
                justification: 'Revisit a weak area with more confidence and a deeper understanding.',
            },
            {
                time: '7:45 PM - 9:00 PM',
                subject: input.subjects.split(',')[1] || 'Second Subject',
                topic: 'Hands-on Practice',
                activity: 'Complete a full exercise set from your textbook or an online interactive course.',
                resources: ['Codewars (for coding)', 'Your course material'],
                justification: 'Solidify understanding through focused repetition.',
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
                activity: 'Take a practice quiz covering all topics from this week. Time yourself to simulate exam conditions.',
                resources: ['Past exam papers', 'Online mock test websites'],
                justification: 'Simulate exam conditions to identify remaining gaps and manage time.',
            },
        ],
      },
      { day: 'Saturday', sessions: [] },
      { day: 'Sunday', sessions: [] },
    ],
  };
}
