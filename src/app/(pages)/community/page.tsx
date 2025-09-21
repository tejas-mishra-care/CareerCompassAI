
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, HeartHandshake, ArrowRight, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function CommunityPage() {
  
  return (
    <AppShell>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Community Hub
            </h1>
            <p className="text-muted-foreground">
              Connect, learn, and grow with your peers and mentors.
            </p>
          </div>
        </div>

        {/* Peer Groups */}
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">
                    <Users className="text-primary inline-block mr-3" /> Peer Groups
                </CardTitle>
                <CardDescription>
                    Join groups based on your interests, goals, and location. (Coming Soon)
                </CardDescription>
            </CardHeader>
            <CardContent className="filter blur-sm opacity-50">
                 <div className="grid gap-4 md:grid-cols-3">
                    {['AI & Machine Learning', 'Sustainable Tech', 'Fintech Innovators'].map(name => (
                        <Card key={name}>
                            <CardHeader>
                                 <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 bg-secondary text-secondary-foreground">
                                        <AvatarFallback>{name.substring(0,1)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg font-headline">{name}</CardTitle>
                                        <CardDescription>1,204 members</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter>
                                <Button className="w-full" disabled>Join Group</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </CardContent>
             <CardFooter>
                <Button variant="outline" disabled>
                    <Search className="mr-2" /> Explore More Groups
                </Button>
            </CardFooter>
        </Card>

        {/* Q&A Forums */}
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">
                    <MessageSquare className="text-primary inline-block mr-3" /> Q&A Forums
                </CardTitle>
                <CardDescription>
                    Ask questions, share your knowledge, and get answers from the community. (Coming Soon)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 filter blur-sm opacity-50">
                <div className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold">Is a Master's degree worth it for a career in Data Science in India?</p>
                        <p className="text-sm text-muted-foreground">Asked by Aarav Sharma &middot; 12 answers &middot; Last activity 2 hours ago</p>
                    </div>
                    <Button variant="ghost" size="icon"><ArrowRight /></Button>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex w-full space-x-2">
                    <Input placeholder="Ask a question..." disabled />
                    <Button disabled><Plus className="mr-2" /> New Post</Button>
                </div>
            </CardFooter>
        </Card>
        
        {/* Mentor Connect */}
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">
                    <HeartHandshake className="text-primary inline-block mr-3" /> Mentor Connect
                </CardTitle>
                <CardDescription>
                    Find experienced professionals to guide you on your career journey. (Coming Soon)
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 filter blur-sm opacity-50">
                {['Rohan Verma', 'Anika Reddy'].map(name => (
                    <div key={name} className="p-4 border rounded-lg flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback>{name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                             <p className="font-bold">{name}</p>
                             <p className="text-sm text-muted-foreground">Senior Product Manager</p>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button variant="outline" disabled>
                    Find a Mentor
                </Button>
            </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
