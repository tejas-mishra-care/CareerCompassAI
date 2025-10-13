
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { GraduationCap } from 'lucide-react';
import { Progress } from '../ui/progress';
import Link from 'next/link';
import type { Pathway } from '@/lib/types';
import { slugify } from '@/lib/utils';

const PathwayItem = ({ pathway }: { pathway: Pathway }) => {
    const completedSteps = pathway.steps.filter(s => s.completed).length;
    const progress = (completedSteps / pathway.steps.length) * 100;
    const pathwayId = slugify(pathway.title);

    return (
        <Link href={`/pathways/${pathwayId}`} className="block">
            <div className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold text-base truncate">{pathway.title.replace('Learning Pathway for: ', '')}</h4>
                <div className="flex items-center gap-4 mt-2">
                    <Progress value={progress} className="h-2" />
                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        {completedSteps} / {pathway.steps.length}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export function MyActivePathways() {
  const { userProfile } = useUserProfile();

  const activePathways = userProfile?.activePathways || [];

  if (activePathways.length === 0) {
    return null; // Don't show the card if there are no active pathways
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <GraduationCap className="h-6 w-6 inline-block mr-2" />
          My Active Pathways
        </CardTitle>
        <CardDescription>
          Your current learning journeys. Keep up the great work!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activePathways.slice(0, 3).map((pathway) => (
            <PathwayItem key={pathway.title} pathway={pathway} />
        ))}
        {activePathways.length > 3 && (
            <p className="text-sm text-muted-foreground text-center">And {activePathways.length - 3} more...</p>
        )}
      </CardContent>
    </Card>
  );
}
// Updated
