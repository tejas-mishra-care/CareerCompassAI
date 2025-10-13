
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, User, BrainCircuit } from 'lucide-react';
import { exploreCareersWithChatbot } from '@/ai/flows/explore-careers-with-chatbot';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export function CareerChatbot() {
  const { userProfile } = useUserProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const userProfileString = useMemo(() => {
    if (!userProfile) return undefined;
    return `Name: ${userProfile.name}. Bio: ${userProfile.bio}. Skills: ${userProfile.skills.map(s => `${s.name} (Proficiency: ${s.proficiency}/100)`).join(', ')}.`;
  }, [userProfile]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await exploreCareersWithChatbot({ 
        question: input,
        userProfile: userProfileString,
      });
      const botMessage: Message = { sender: 'bot', text: response.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chatbot error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
        <header className="mb-4">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Career Explorer</h1>
            <p className="text-muted-foreground">Ask me anything about careers, skills, or industries!</p>
        </header>

        <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                        <BrainCircuit size={48} className="mb-4 text-primary"/>
                        <p className="text-lg font-semibold font-headline">Welcome to the Career Explorer!</p>
                        <p className="text-sm">You can ask questions like:</p>
                        <ul className="text-xs list-disc list-inside mt-2">
                            <li>"What does a product manager do?"</li>
                            <li>"What skills do I need for data science?"</li>
                            <li>"Based on my profile, what's a good next career step?"</li>
                        </ul>
                    </div>
                )}
                {messages.map((message, index) => (
                    <div
                    key={index}
                    className={cn(
                        'flex items-start gap-3',
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                    >
                    {message.sender === 'bot' && (
                        <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-5 w-5" />
                        </AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                        'max-w-sm md:max-w-md lg:max-w-2xl rounded-xl px-4 py-3 text-sm whitespace-pre-line',
                        message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                    >
                        {message.text}
                    </div>
                    {message.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                {loading && (
                     <div className='flex items-start gap-3 justify-start'>
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[250px]" />
                           <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
            <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={loading}
                    className="flex-1"
                />
                <Button type="submit" disabled={loading || !input.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
                </form>
            </div>
            </CardContent>
        </Card>
    </div>
  );
}
// Updated
