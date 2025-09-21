
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, HeartHandshake, ArrowRight, Search, Plus, Bot, Laptop, Banknote } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const suggestedGroups = [
    { name: 'AI & Machine Learning', members: 1204, category: 'Emerging Tech', icon: <Bot /> },
    { name: 'Sustainable Tech & ESG', members: 458, category: 'Industry', icon: <Laptop /> },
    { name: 'Fintech & DeFi Innovators', members: 891, category: 'Industry', icon: <Banknote /> },
];

const featuredMentors = [
    {
        name: 'Rohan Verma',
        title: 'Senior Product Manager at Google',
        avatar: '/avatars/01.png',
    },
    {
        name: 'Anika Reddy',
        title: 'Lead UX Designer at Swiggy',
        avatar: '/avatars/02.png',
    },
]

export default function CommunityPage() {
  const { toast } = useToast();

  const handleJoinGroup = (groupName: string) => {
    toast({
      title: 'Joining Group!',
      description: `You've joined the "${groupName}" group. Welcome to the community!`,
    });
    // In a real app, this would involve a backend call to add the user to the group
  };
  
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
                    Join groups based on your interests, goals, and location to learn and collaborate with like-minded peers.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
                {suggestedGroups.map(group => (
                    <Card key={group.name} className="flex flex-col">
                        <CardHeader>
                             <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 bg-secondary text-secondary-foreground">
                                    <AvatarFallback>{group.icon}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg font-headline">{group.name}</CardTitle>
                                    <CardDescription>{group.members.toLocaleString()} members</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <Badge variant="secondary">{group.category}</Badge>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleJoinGroup(group.name)}>Join Group</Button>
                        </CardFooter>
                    </Card>
                ))}
            </CardContent>
             <CardFooter>
                <Button variant="outline">
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
            <CardContent className="grid gap-4 md:grid-cols-2">
                {featuredMentors.map(mentor => (
                    <div key={mentor.name} className="p-4 border rounded-lg flex items-center gap-4 filter blur-sm opacity-50">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${mentor.name}`} />
                            <AvatarFallback>{mentor.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                             <p className="font-bold">{mentor.name}</p>
                             <p className="text-sm text-muted-foreground">{mentor.title}</p>
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
