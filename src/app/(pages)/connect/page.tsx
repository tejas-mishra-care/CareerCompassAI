import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users, Link as LinkIcon, HeartHandshake } from 'lucide-react';

export default function ConnectPage() {
  return (
    <AppShell>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Connect & Share
          </h1>
        </div>
        <p className="text-muted-foreground">
          Extend your journey by connecting with counselors and family. Your data is only shared with your explicit permission.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-3">
                        <HeartHandshake className="text-primary h-6 w-6" /> Counselor Connect
                    </CardTitle>
                    <CardDescription>
                        Grant a verified career counselor access to your Skill Dashboard to receive personalized, data-informed guidance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Your counselor will be able to see your "Living CV," including your skill history, completed pathways, and AI-driven recommendations. This allows them to provide high-empathy, effective advice without the guesswork.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button disabled>Connect with a Counselor (Coming Soon)</Button>
                </CardFooter>
            </Card>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-3">
                        <Users className="text-primary h-6 w-6" /> Parent & Guardian Portal
                    </CardTitle>
                    <CardDescription>
                        Generate a secure, read-only link to share your progress with a parent or guardian. You control what they see and can revoke access at any time.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Provide your family with insight into your career exploration journey. The parent view offers a simplified dashboard showing your progress, identified strengths, and the pathways you're exploring.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button disabled>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Generate Sharing Link (Coming Soon)
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <Card className="border-dashed shadow-none">
            <CardHeader className="flex-row items-center gap-4">
                <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                <div>
                    <h3 className="font-semibold">Your Privacy is Our Priority</h3>
                    <p className="text-sm text-muted-foreground">
                        No data is ever shared without your consent. You have full control over who sees your profile and can revoke access at any moment.
                    </p>
                </div>
            </CardHeader>
        </Card>
      </div>
    </AppShell>
  );
}
