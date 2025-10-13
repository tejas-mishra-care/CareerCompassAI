
'use client';
import { useState, useEffect } from 'react';
import {
  getOpportunityRadar,
  type Opportunity,
} from '@/ai/flows/opportunity-radar';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, MapPin, Sparkles, ExternalLink, Briefcase } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '../ui/progress';


const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    return (
        <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-base">{opportunity.title}</h4>
                    <p className="text-sm text-muted-foreground">{opportunity.company}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {opportunity.location}
                    </p>
                </div>
                 <div className="text-right">
                    <div className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-bold text-lg text-primary">{opportunity.matchScore}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                </div>
            </div>
            <div className="mt-3">
                 <Progress value={opportunity.matchScore} className="h-1" />
            </div>
            <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" asChild>
                    <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                        View Details <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </div>
        </div>
    )
}

const RadarSkeleton = () => (
    <Card>
      <CardHeader>
        <CardTitle>
          <Target className="h-6 w-6 inline-block mr-2" />
          Opportunity Radar
        </CardTitle>
        <CardDescription>
          Scanning for jobs and internships...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="text-right space-y-1">
                        <Skeleton className="h-6 w-16 ml-auto" />
                        <Skeleton className="h-3 w-12 ml-auto" />
                    </div>
                </div>
                 <Skeleton className="h-1 w-full mt-3" />
                 <div className="flex justify-end mt-4">
                    <Skeleton className="h-8 w-28" />
                 </div>
            </div>
        ))}
      </CardContent>
    </Card>
);

export function OpportunityRadar() {
  const { userProfile, setUserProfile, isProfileComplete } = useUserProfile();
  const [opportunities, setOpportunities] = useState<Opportunity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!userProfile) return;
      setLoading(true);
      try {
        const profileString = `Name: ${userProfile.name}. Bio: ${
          userProfile.bio
        }. Skills: ${userProfile.skills
          .map((s) => `${s.name} (Proficiency: ${s.proficiency}/100)`)
          .join(', ')}. Goal: ${userProfile.goal}`;

        const result = await getOpportunityRadar({ userProfile: profileString });
        
        setOpportunities(result.opportunities);
        await setUserProfile({ 
            ...userProfile, 
            opportunities: result.opportunities,
            opportunitiesLastUpdated: Date.now(),
        });

      } catch (error) {
        console.error('Failed to get opportunities:', error);
        toast({
          variant: 'destructive',
          title: 'Radar Error',
          description: 'Could not fetch job opportunities.',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (isProfileComplete) {
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const lastUpdated = userProfile.opportunitiesLastUpdated || 0;

      if (userProfile.opportunities && (now - lastUpdated < oneWeek)) {
        setOpportunities(userProfile.opportunities);
        setLoading(false);
      } else {
        fetchOpportunities();
      }
    } else {
       setLoading(false);
    }
  }, [isProfileComplete, userProfile, setUserProfile, toast]);

  if (!isProfileComplete) {
    return null;
  }
  
  if (loading) {
    return <RadarSkeleton />;
  }

  if (!opportunities || opportunities.length === 0) {
    return null; // Or a message saying no opportunities found
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Target className="h-6 w-6 inline-block mr-2" />
          Opportunity Radar
        </CardTitle>
        <CardDescription>
          Proactive job and internship matches based on your profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities.map((opp) => (
            <OpportunityCard key={opp.title + opp.company} opportunity={opp} />
        ))}
      </CardContent>
    </Card>
  );
}
// Updated
