import type { Simulation } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function SimulationCard({ simulation }: { simulation: Simulation }) {
  const cardContent = (
    <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <CardTitle className="font-headline text-xl">{simulation.title}</CardTitle>
            <Badge variant="outline" className="text-primary border-primary shrink-0 flex gap-1 items-center">
                <Sparkles className="h-3 w-3" /> {simulation.spYield} SP
            </Badge>
        </div>
        <CardDescription>{simulation.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
            {simulation.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    <BrainCircuit className="h-3 w-3" /> {skill}
                </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!simulation.href}>
          {simulation.href ? 'Start Simulation' : 'Launch Simulation (Coming Soon)'} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  if (simulation.href) {
    return <Link href={simulation.href} className="flex h-full">{cardContent}</Link>
  }
  return cardContent;
}
