'use server';
/**
 * @fileOverview Implements AI flows for a mock interview simulator.
 *
 * - generateInterviewQuestions: Creates a list of interview questions for a given role.
 * - getInterviewFeedback: Provides feedback on a user's answer to a question.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for generating questions
const InterviewQuestionsInputSchema = z.object({
  role: z.string().describe('The job role the user is practicing for, e.g., "Software Engineer".'),
});
export type InterviewQuestionsInput = z.infer<typeof InterviewQuestionsInputSchema>;

const InterviewQuestionsOutputSchema = z.object({
  questions: z.array(z.object({
    type: z.enum(['behavioral', 'technical']).describe('The type of question.'),
    question: z.string().describe('The interview question.'),
  })).describe('A list of 5-7 interview questions, with a mix of behavioral and technical.'),
});
export type InterviewQuestionsOutput = z.infer<typeof InterviewQuestionsOutputSchema>;

// Schema for getting feedback
const InterviewFeedbackInputSchema = z.object({
  question: z.string().describe('The interview question that was asked.'),
  answer: z.string().describe("The user's answer to the question."),
});
export type InterviewFeedbackInput = z.infer<typeof InterviewFeedbackInputSchema>;

const InterviewFeedbackOutputSchema = z.object({
    feedback: z.string().describe("Constructive, actionable feedback on the user's answer. Address the content, structure, and clarity. Suggest specific improvements."),
});
export type InterviewFeedbackOutput = z.infer<typeof InterviewFeedbackOutputSchema>;


// Exported functions
export async function generateInterviewQuestions(input: InterviewQuestionsInput): Promise<InterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

export async function getInterviewFeedback(input: InterviewFeedbackInput): Promise<InterviewFeedbackOutput> {
  return getInterviewFeedbackFlow(input);
}


// Prompt for generating questions
const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: { schema: InterviewQuestionsInputSchema },
  output: { schema: InterviewQuestionsOutputSchema },
  prompt: `You are an expert career coach in India. A user wants to practice for an interview for the role of "{{role}}".
  
  Generate a list of 5-7 relevant interview questions.
  - Include a mix of behavioral questions (using the STAR method context) and technical questions.
  - The questions should be relevant to the Indian job market for this role.
  
  Return the questions as a structured JSON object.`,
});

// Prompt for providing feedback
const getFeedbackPrompt = ai.definePrompt({
    name: 'getInterviewFeedbackPrompt',
    input: { schema: InterviewFeedbackInputSchema },
    output: { schema: InterviewFeedbackOutputSchema },
    prompt: `You are an expert interview coach. A user has answered an interview question. Provide constructive feedback.

Question: "{{question}}"
User's Answer: "{{answer}}"

Your Task:
1.  Analyze the answer for clarity, structure (like the STAR method for behavioral questions), and technical accuracy.
2.  Provide concise, actionable feedback.
3.  Start with something positive, then suggest 1-2 specific areas for improvement.
4.  Keep the feedback to 2-3 sentences.
5.  If the answer is very short or vague, encourage the user to provide more detail.

Example Feedback: "That's a good start in describing the project. To make it stronger, try to explicitly state the 'Result' of your actions. For instance, how did your work impact the project's success? Did it improve a metric by a certain percentage?"

Return the feedback as a structured JSON object.`,
});


// Flow for generating questions
const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: InterviewQuestionsInputSchema,
    outputSchema: InterviewQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateQuestionsPrompt(input);
    return output!;
  }
);

// Flow for providing feedback
const getInterviewFeedbackFlow = ai.defineFlow(
    {
        name: 'getInterviewFeedbackFlow',
        inputSchema: InterviewFeedbackInputSchema,
        outputSchema: InterviewFeedbackOutputSchema,
    },
    async (input) => {
        const { output } = await getFeedbackPrompt(input);
        return output!;
    }
);
// Updated
