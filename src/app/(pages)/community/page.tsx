
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, HeartHandshake, ArrowRight, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const suggestedGroups = [
    { name: 'Aspiring Product Managers', members: 128, category: 'Careers' },
    { name: 'Nagpur Tech Students', members: 256, category: 'Location' },
    { name: 'UI/UX Design Enthusiasts', members: 432, category: 'Skills' },
];

const forumPosts = [
    {
        question: "Is a Master's degree worth it for a career in Data Science in India?",
        author: 'Aarav Sharma',
        answers: 12,
        lastActivity: '2 hours ago',
    },
    {
        question: 'Best resources to prepare for the technical rounds at top product companies?',
        author: 'Priya Singh',
        answers: 28,
        lastActivity: '1 day ago',
    },
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
                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                    <Users className="text-primary" /> Peer Groups
                </CardTitle>
                <CardDescription>
                    Join groups based on your interests, goals, and location to learn and collaborate with like-minded peers.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
                {suggestedGroups.map(group => (
                    <Card key={group.name} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            <CardDescription>{group.members} members</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <Badge variant="secondary">{group.category}</Badge>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Join Group</Button>
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
                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                    <MessageSquare className="text-primary" /> Q&A Forums
                </CardTitle>
                <CardDescription>
                    Ask questions, share your knowledge, and get answers from the community.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {forumPosts.map(post => (
                    <div key={post.question} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{post.question}</p>
                            <p className="text-sm text-muted-foreground">Asked by {post.author} &middot; {post.answers} answers &middot; Last activity {post.lastActivity}</p>
                        </div>
                        <Button variant="ghost" size="icon"><ArrowRight /></Button>
                    </div>
               ))}
            </CardContent>
            <CardFooter>
                <div className="flex w-full space-x-2">
                    <Input placeholder="Ask a question..." />
                    <Button><Plus className="mr-2" /> New Post</Button>
                </div>
            </CardFooter>
        </Card>
        
        {/* Mentor Connect */}
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                    <HeartHandshake className="text-primary" /> Mentor Connect
                </CardTitle>
                <CardDescription>
                    Find experienced professionals to guide you on your career journey. (Coming Soon)
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                {featuredMentors.map(mentor => (
                    <div key={mentor.name} className="p-4 border rounded-lg flex items-center gap-4">
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
