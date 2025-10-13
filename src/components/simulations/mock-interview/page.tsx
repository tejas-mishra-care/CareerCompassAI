
'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wand2, Send, Lightbulb, User, Bot, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateInterviewQuestions, getInterviewFeedback } from '@/ai/flows/mock-interview-flow';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

type Question = {
  type: 'behavioral' | 'technical';
  question: string;
};

type Feedback = {
  feedback: string;
};

enum Stage {
  Setup,
  Interview,
  Feedback,
}

export default function MockInterviewPage() {
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [stage, setStage] = useState<Stage>(Stage.Setup);
  const [loading, setLoading] = useState<'questions' | 'feedback' | null>(null);
  const { toast } = useToast();
  
  const handleStart = async () => {
    if (!role.trim()) {
      toast({ variant: 'destructive', title: 'Please enter a job role.' });
      return;
    }
    setLoading('questions');
    try {
      const result = await generateInterviewQuestions({ role });
      setQuestions(result.questions);
      setStage(Stage.Interview);
    } catch (error) {
      console.error('Failed to generate questions:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not generate interview questions.' });
    } finally {
      setLoading(null);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
        toast({ variant: 'destructive', title: 'Please enter an answer.' });
        return;
    }
    setLoading('feedback');
    setFeedback(null);
    try {
      const result = await getInterviewFeedback({
        question: questions[currentQuestionIndex].question,
        answer: userAnswer,
      });
      setFeedback(result);
      setStage(Stage.Feedback);
    } catch (error) {
      console.error('Failed to get feedback:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not get feedback on your answer.' });
    } finally {
      setLoading(null);
    }
  };

  const handleNextQuestion = () => {
    setStage(Stage.Interview);
    setFeedback(null);
    setUserAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of interview
      handleReset();
      toast({ title: 'Interview Complete!', description: "You've completed all the questions." });
    }
  };
  
  const handleTryAnotherAnswer = () => {
    setStage(Stage.Interview);
    setFeedback(null);
  }

  const handleReset = () => {
    setRole('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setStage(Stage.Setup);
    setLoading(null);
  };

  const renderSetup = () => (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>AI Mock Interview</CardTitle>
        <CardDescription>Enter a job role you want to practice for, and our AI will generate relevant interview questions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="e.g., 'Software Engineer' or 'Product Manager'"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            className="text-base"
            disabled={loading === 'questions'}
          />
          <Button onClick={handleStart} disabled={loading === 'questions'}>
            {loading === 'questions' ? <Loader2 className="animate-spin" /> : <Wand2 className="mr-2" />}
            Generate Questions
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderInterview = () => {
    if (questions.length === 0) return null;
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <Card className="max-w-3xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
          <div className="flex items-center justify-between">
            <CardDescription>Role: {role}</CardDescription>
            <Badge variant={currentQuestion.type === 'technical' ? 'destructive' : 'secondary'}>{currentQuestion.type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-secondary/50">
            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 mt-1 text-primary shrink-0" />
              <p className="text-lg font-semibold">{currentQuestion.question}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer" className="flex items-center gap-2 font-semibold">
              <User className="h-5 w-5" /> Your Answer
            </Label>
            <Textarea
              id="answer"
              placeholder="Structure your answer clearly..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={8}
              disabled={loading === 'feedback'}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmitAnswer} disabled={loading === 'feedback'}>
              {loading === 'feedback' ? <Loader2 className="animate-spin" /> : <Send className="mr-2" />}
              Get Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderFeedback = () => {
    if (!feedback) return null;
     const currentQuestion = questions[currentQuestionIndex];

    return (
      <Card className="max-w-3xl mx-auto w-full">
        <CardHeader>
           <CardTitle>Feedback on Your Answer</CardTitle>
           <CardDescription>Review the AI's feedback and prepare for the next question.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="p-4 border rounded-lg bg-secondary/30 space-y-4">
                 <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Question:</p>
                    <div className="flex items-start gap-3">
                        <Bot className="h-5 w-5 mt-1 text-primary shrink-0" />
                        <p className="font-medium">{currentQuestion.question}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Your Answer:</p>
                     <div className="flex items-start gap-3">
                        <User className="h-5 w-5 mt-1 shrink-0" />
                        <p className="text-muted-foreground whitespace-pre-line">{userAnswer}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 mt-1 text-green-600 dark:text-green-400 shrink-0" />
                <div>
                    <h4 className="font-bold text-green-800 dark:text-green-300 font-headline">AI Feedback</h4>
                    <p className="text-green-700 dark:text-green-400/90 whitespace-pre-line">{feedback.feedback}</p>
                </div>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={handleTryAnotherAnswer}>Try Again</Button>
                <Button onClick={handleNextQuestion}>
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                    <ChevronRight className="ml-2" />
                </Button>
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <AppShell>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 flex justify-center items-start">
        {stage === Stage.Setup && renderSetup()}
        {stage === Stage.Interview && renderInterview()}
        {stage === Stage.Feedback && renderFeedback()}
      </div>
       {stage !== Stage.Setup && (
         <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
            <Button variant="outline" size="sm" onClick={handleReset}>
                <ChevronLeft className="mr-2" /> End Simulation
            </Button>
         </div>
       )}
    </AppShell>
  );
}
// Updated
