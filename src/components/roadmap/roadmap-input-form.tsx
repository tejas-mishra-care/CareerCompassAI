'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User, Book, Clock, Target, BarChart2, Lightbulb, Loader2 } from 'lucide-react';
import type { GenerateLearningRoadmapInput } from '@/ai/flows/generate-learning-roadmap';

interface RoadmapInputFormProps {
  formData: GenerateLearningRoadmapInput;
  setFormData: React.Dispatch<React.SetStateAction<GenerateLearningRoadmapInput>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  generateRoadmap: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const RoadmapInputForm: React.FC<RoadmapInputFormProps> = ({ formData, handleInputChange, generateRoadmap, isLoading }) => {
  
  const formFields = [
    { name: 'name', label: 'Your Name', placeholder: 'e.g., Alex Johnson', icon: <User />, required: true, type: 'input' },
    { name: 'subjects', label: 'Subjects to Learn', placeholder: 'e.g., Math, Physics, React', icon: <Book />, required: true, type: 'input' },
    { name: 'goal', label: 'Your Goal', placeholder: 'e.g., Pass final exams in 3 weeks', icon: <Target />, required: true, type: 'textarea' },
    { name: 'timeAvailability', label: 'When can you study?', placeholder: 'e.g., Weekdays 6-9 PM, Weekends 10 AM - 4 PM', icon: <Clock />, required: true, type: 'textarea' },
    { name: 'learningStyle', label: 'Your Learning Style', placeholder: 'e.g., Visual learner, prefer practice problems', icon: <Lightbulb />, required: true, type: 'textarea' },
    { name: 'weakAreas', label: 'Weak Areas (Optional)', placeholder: 'e.g., Calculus integration, CSS Flexbox', icon: <BarChart2 />, required: false, type: 'textarea' },
  ] as const;

  return (
    <Card className="sticky top-8">
        <CardHeader>
            <CardTitle>Create Your Plan</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={generateRoadmap} className="space-y-4">
                {formFields.map(field => (
                <div key={field.name}>
                    <Label htmlFor={field.name} className="flex items-center gap-2 mb-1">
                        {React.cloneElement(field.icon, { className: 'h-4 w-4' })}
                        {field.label} {field.required && <span className="text-destructive">*</span>}
                    </Label>
                    {field.type === 'input' ? (
                         <Input
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            required={field.required}
                            disabled={isLoading}
                        />
                    ) : (
                         <Textarea
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            required={field.required}
                            disabled={isLoading}
                            rows={2}
                        />
                    )}
                </div>
                ))}
                <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                >
                {isLoading ? (
                    <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Generating...
                    </>
                ) : (
                    'Generate My Roadmap'
                )}
                </Button>
            </form>
      </CardContent>
    </Card>
  );
};
