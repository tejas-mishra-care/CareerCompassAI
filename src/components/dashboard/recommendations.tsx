
'use client';
import { useState, useEffect } from 'react';
import {
  getCareerRecommendations,
  type CareerRecommendationsOutput,
} from '@/ai/flows/career-recommendations-from-profile';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  <Card className="h-full">
    <CardHeader>
      <CardTitle>
        <Lightbulb className="h-6 w-6 inline-block mr-2" />
        Recommended For You
      </CardTitle>
      <CardDescription>
        Generating AI-powered suggestions...
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </CardContent>
  </Card>
);

export function Recommendations() {
  const { userProfile, setUserProfile } = useUserProfile();
  const [recommendations, setRecommendations] = useState<CareerRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userProfile) return;
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
        // Cache the results
        await setUserProfile({ 
            ...userProfile, 
            recommendations: result,
            recommendationsLastUpdated: Date.now(),
        });
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
    
    if (userProfile?.isProfileComplete) {
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const lastUpdated = userProfile.recommendationsLastUpdated || 0;

      if (userProfile.recommendations && (now - lastUpdated < oneWeek)) {
        // Use cached recommendations
        setRecommendations(userProfile.recommendations);
        setLoading(false);
      } else {
        // Fetch new recommendations
        fetchRecommendations();
      }
    } else {
       setLoading(false);
    }
  }, [userProfile, setUserProfile, toast]);

  if (loading) {
    return <RecommendationsSkeleton />;
  }

  if (!recommendations) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <Lightbulb className="h-6 w-6 inline-block mr-2" />
          Recommended For You
        </CardTitle>
        <CardDescription>
          AI-powered actions based on your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="recommendations">
          <AccordionItem value="recommendations">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Top Career Paths
            </AccordionTrigger>
            <AccordionContent className="pt-2 space-y-3">
              {recommendations.careerRecommendations.map((rec) => (
                <div
                  key={rec}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
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
              Why These?
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
// Updated
