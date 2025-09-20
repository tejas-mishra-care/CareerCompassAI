// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Implements a Genkit flow that allows users to ask questions about different careers
 *   and get helpful answers from a conversational AI chatbot.
 *
 * - exploreCareersWithChatbot - A function that handles the career exploration process.
 * - ExploreCareersWithChatbotInput - The input type for the exploreCareersWithChatbot function.
 * - ExploreCareersWithChatbotOutput - The return type for the exploreCareersWithChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExploreCareersWithChatbotInputSchema = z.object({
  question: z.string().describe('The user question about careers.'),
});
export type ExploreCareersWithChatbotInput = z.infer<typeof ExploreCareersWithChatbotInputSchema>;

const ExploreCareersWithChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot answer to the user question.'),
});
export type ExploreCareersWithChatbotOutput = z.infer<typeof ExploreCareersWithChatbotOutputSchema>;

export async function exploreCareersWithChatbot(
  input: ExploreCareersWithChatbotInput
): Promise<ExploreCareersWithChatbotOutput> {
  return exploreCareersWithChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'exploreCareersWithChatbotPrompt',
  input: {schema: ExploreCareersWithChatbotInputSchema},
  output: {schema: ExploreCareersWithChatbotOutputSchema},
  prompt: `You are a career exploration chatbot. A user will ask a question about a career, and you should provide a helpful answer.

Question: {{{question}}}`,
});

const exploreCareersWithChatbotFlow = ai.defineFlow(
  {
    name: 'exploreCareersWithChatbotFlow',
    inputSchema: ExploreCareersWithChatbotInputSchema,
    outputSchema: ExploreCareersWithChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
