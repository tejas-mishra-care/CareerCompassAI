'use server';
/**
 * @fileOverview Implements a Genkit flow for a conversational onboarding experience.
 *
 * - getOnboardingQuestion - A function that generates a new onboarding question.
 * - OnboardingQuestionInput - The input type for the getOnboardingQuestion function.
 * - OnboardingQuestionOutput - The return type for the getOnboardingQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const OnboardingQuestionInputSchema = z.object({
  previousAnswers: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).describe('A list of questions and answers from the current onboarding session.'),
  currentTopic: z.string().describe("The current topic of the conversation (e.g., 'Interests', 'Skills', 'Goals').")
});
export type OnboardingQuestionInput = z.infer<typeof OnboardingQuestionInputSchema>;

const OnboardingQuestionOutputSchema = z.object({
    question: z.string().describe('The next engaging, gamified question to ask the user.'),
    options: z.array(z.string()).optional().describe('A list of multiple-choice options if applicable. The AI should create these.'),
    topic: z.string().describe("The topic of the generated question (e.g., 'Interests', 'Skills', 'Goals')."),
});
export type OnboardingQuestionOutput = z.infer<typeof OnboardingQuestionOutputSchema>;

export async function getOnboardingQuestion(
  input: OnboardingQuestionInput
): Promise<OnboardingQuestionOutput> {
  return onboardingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'onboardingPrompt',
  input: {schema: OnboardingQuestionInputSchema},
  output: {schema: OnboardingQuestionOutputSchema},
  prompt: `You are an AI assistant creating a fun, conversational onboarding experience. Your goal is to understand the user's personality, interests, and baseline skills without it feeling like a form.

The onboarding process has three topics: 'Interests', 'Skills', and 'Goals'.

Current conversation topic: {{{currentTopic}}}

{{#if previousAnswers.length}}
Previous questions and answers:
{{#each previousAnswers}}
Q: {{this.question}}
A: {{this.answer}}
{{/each}}
{{/if}}

Based on the topic and previous conversation, generate the NEXT question.
- The question should be engaging and feel like part of a natural conversation.
- If it makes sense, provide 3-4 multiple-choice options.
- Frame questions to reveal personality (creative, analytical), work style preferences, or latent interests.
- For the 'Skills' topic, you can ask a simple challenge or logic puzzle.
- Keep the topic consistent with the current topic, unless you have enough information to move to the next one.
- The progression should be 'Interests' -> 'Skills' -> 'Goals'.

Example for 'Interests': "A weekend project! What sounds most fun? a) Building a custom PC, b) Writing a short story, c) Organizing a community event."
Example for 'Skills': "Here's a quick puzzle: A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?"
Example for 'Goals': "Looking one year ahead, what's a headline you'd love to read about yourself?"

Generate the next question and options.
`,
});

const onboardingFlow = ai.defineFlow(
  {
    name: 'onboardingFlow',
    inputSchema: OnboardingQuestionInputSchema,
    outputSchema: OnboardingQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
// Updated
