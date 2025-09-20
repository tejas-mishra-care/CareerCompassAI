
'use client';

import React, { useState, useMemo } from 'react';
import {
  aiSearchAndDiscovery,
  type AiSearchAndDiscoveryOutput,
} from '@/ai/flows/ai-search-and-discovery';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Briefcase,
  Lightbulb,
  GraduationCap,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Progress } from '../ui/progress';

type Result = AiSearchAndDiscoveryOutput['results'][0];

const typeConfig = {
  career: { icon: Briefcase, color: 'text-blue-500' },
  skill: { icon: Lightbulb, color: 'text-orange-500' },
  course: { icon: GraduationCap, color: 'text-green-500' },
};

const ResultCard = ({ result }: { result: Result }) => {
  const { icon: Icon, color } = typeConfig[result.type] || { icon: BookOpen, color: 'text-gray-500' };

  return (
    <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Icon className={`h-5 w-5 ${color}`} />
                {result.title}
            </CardTitle>
            <Badge variant="secondary" className="capitalize">{result.type}</Badge>
        </div>
        <CardDescription>{result.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        {result.relevanceScore && (
          <div>
            <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Match Score
                </p>
                <p className="text-xs font-bold text-primary">{result.relevanceScore}%</p>
            </div>
            <Progress value={result.relevanceScore} aria-label={`Match score ${result.relevanceScore}%`} className="h-2"/>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SearchSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <div className="flex justify-between">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-2 w-full" />
                </CardContent>
            </Card>
        ))}
    </div>
)

export function UnifiedSearch() {
  const { userProfile } = useUserProfile();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AiSearchAndDiscoveryOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const userProfileString = useMemo(() => {
    if (!userProfile) return undefined;
    return `Name: ${userProfile.name}. Bio: ${userProfile.bio}. Skills: ${userProfile.skills.map(s => `${s.name} (Proficiency: ${s.proficiency}/100)`).join(', ')}.`;
  }, [userProfile]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    try {
      const searchResult = await aiSearchAndDiscovery({
        query,
        userProfile: userProfileString,
      });
      // Sort results by relevance score
      searchResult.results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      setResults(searchResult);
    } catch (error) {
      console.error('Failed to search:', error);
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
          placeholder="e.g., 'Creative jobs in tech' or 'Learn Python for data analysis'"
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
          {results.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.results.map((result, index) => (
                <ResultCard key={`${result.title}-${index}`} result={result} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
                <Briefcase size={48} className="mx-auto mb-4"/>
                <h3 className="text-xl font-semibold">No results found</h3>
                <p>Try a different search term to find your perfect match.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
