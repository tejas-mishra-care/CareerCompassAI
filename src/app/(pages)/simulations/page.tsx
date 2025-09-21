
import { AppShell } from '@/components/layout/app-shell';
import { SimulationCard } from '@/components/simulations/simulation-card';
import placeholderImagesData from '@/lib/placeholder-images.json';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { Simulation } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

const availableSimulations: Simulation[] = [
    {
        id: 'mock-interview',
        title: 'AI Mock Interview',
        description: 'Practice for your next job interview. Get instant AI feedback on your answers to common technical and behavioral questions.',
        skills: ['Interview Skills', 'Communication', 'STAR Method'],
        spYield: 150,
        imageHint: 'job interview',
        href: '/simulations/mock-interview',
    },
    {
        id: 'marketing-challenge',
        title: 'Marketing Budget Challenge',
        description: 'You have $50,000 to launch a new product. Allocate your budget across different marketing channels to maximize reach and ROI.',
        skills: ['Strategic Thinking', 'Data Analysis', 'Financial Planning'],
        spYield: 250,
        imageHint: 'marketing strategy',
    },
    {
        id: 'design-dilemma',
        title: 'UI/UX Design Dilemma',
        description: 'A client wants to add a complex new feature to their app. Balance user experience with technical constraints to design the best solution.',
        skills: ['UX/UI Design', 'Problem Solving', 'Communication'],
        spYield: 220,
        imageHint: 'user interface',
    },
    {
        id: 'server-debug',
        title: 'The Server Is Down!',
        description: 'A critical server has crashed. Analyze the logs, identify the bug in the Python code, and deploy a fix before time runs out.',
        skills: ['Debugging', 'Python', 'Systems Analysis'],
        spYield: 300,
        imageHint: 'server code',
    }
]


export default function SimulationsPage() {
    const heroImage = (placeholderImagesData as ImagePlaceholder[]).find(p => p.id === 'simulations');
  return (
    <AppShell>
      <div className="flex-1 space-y-6">
        {heroImage ? (
             <div className="relative h-64 md:h-80 w-full">
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    data-ai-hint={heroImage.imageHint}
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 md:p-8">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-headline text-foreground">
                        Experiential Library
                    </h1>
                    <p className="max-w-2xl mt-2 text-base md:text-lg text-muted-foreground">
                        Test-drive your future career. Earn valuable Skill Points by solving real-world problems in these interactive simulations.
                    </p>
                </div>
            </div>
        ) : (
             <div className="p-4 md:p-8">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-headline text-foreground">
                    Experiential Library
                </h1>
                <p className="max-w-2xl mt-2 text-base md:text-lg text-muted-foreground">
                    Test-drive your future career. Earn valuable Skill Points by solving real-world problems in these interactive simulations.
                </p>
            </div>
        )}
       
        <div className="p-4 md:p-8 pt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableSimulations.map((sim) => (
                    <SimulationCard key={sim.id} simulation={sim} />
                ))}
            </div>
        </div>
      </div>
    </AppShell>
  );
}
