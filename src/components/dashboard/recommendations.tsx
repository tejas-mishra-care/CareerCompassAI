'use client';
import { useState, useEffect } from 'react';
import {
  getCareerRecommendations,
  type CareerRecommendationsOutput,
} from '@/ai/flows/career-recommendations-from-profile';
import { useUserProfile } from '@/hooks/use-user-profile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BookOpen, ChevronRight } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const RecommendationsSkeleton = () => (
  <Card className="shadow-md">
    <CardHeader>
      <CardTitle className="font-headline flex items-center gap-2 text-2xl">
        <Lightbulb className="h-6 w-6" />
        Personalized Recommendations
      </CardTitle>
      <CardDescription>
        AI-powered career suggestions based on your profile.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
      <Skeleton className="h-20 w-full rounded-md" />
    </CardContent>
  </Card>
);

export function Recommendations() {
  const { userProfile } = useUserProfile();
  const [recommendations, setRecommendations] = useState<CareerRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile?.name) {
      const fetchRecommendations = async () => {
        setLoading(true);
        try {
          const profileString = `Name: ${userProfile.name}. Bio: ${
            userProfile.bio
          }. Skills: ${userProfile.skills
            .map((s) => `${s.name} (Proficiency: ${s.proficiency}/100)`)
            .join(', ')}.`;
          const result = await getCareerRecommendations({
            userProfile: profileString,
          });
          setRecommendations(result);
        } catch (error) {
          console.error('Failed to get career recommendations:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch career recommendations.',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchRecommendations();
    }
  }, [userProfile, toast]);

  if (loading) {
    return <RecommendationsSkeleton />;
  }

  if (!recommendations) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-2xl">
          <Lightbulb className="h-6 w-6" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>
          AI-powered career suggestions based on your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="recommendations">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Top Career Paths For You
            </AccordionTrigger>
            <AccordionContent className="pt-2 space-y-3">
              {recommendations.careerRecommendations.map((rec) => (
                <div
                  key={rec}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <p className="font-medium">{rec}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="reasoning">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Why These Recommendations?
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {recommendations.reasoning}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
