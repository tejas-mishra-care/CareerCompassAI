'use client';

import React, { useState } from 'react';
import {
  aiSearchForCareers,
  type AiSearchForCareersOutput,
} from '@/ai/flows/ai-search-for-careers';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

const ResultCard = ({
  career,
}: {
  career: AiSearchForCareersOutput['careers'][0];
}) => (
  <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="font-headline text-xl">{career.title}</CardTitle>
      <CardDescription>{career.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <h4 className="font-semibold mb-2 text-sm">Required Skills:</h4>
      <div className="flex flex-wrap gap-2">
        {career.requiredSkills.map((skill) => (
          <Badge key={skill} variant="secondary">
            {skill}
          </Badge>
        ))}
      </div>
    </CardContent>
    {career.link && (
      <CardFooter>
        <Button asChild variant="link" className="p-0 h-auto">
          <a href={career.link} target="_blank" rel="noopener noreferrer">
            Find Jobs <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    )}
  </Card>
);

const SearchSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-5 w-1/3" />
                </CardFooter>
            </Card>
        ))}
    </div>
)

export function CareerSearch() {
  const { userProfile } = useUserProfile();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AiSearchForCareersOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const searchResult = await aiSearchForCareers({
        query,
        userSkills: userProfile?.skills.map((s) => s.name),
        userInterests: userProfile?.bio,
      });
      setResults(searchResult);
    } catch (error) {
      console.error('Failed to search for careers:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not perform search. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="e.g., 'Creative jobs in tech' or 'Entry-level marketing roles'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="text-base"
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {loading && <SearchSkeleton />}

      {results && (
        <>
          {results.careers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.careers.map((career) => (
                <ResultCard key={career.title} career={career} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
                <Briefcase size={48} className="mx-auto mb-4"/>
                <h3 className="text-xl font-semibold">No careers found</h3>
                <p>Try a different search term to find your perfect match.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
