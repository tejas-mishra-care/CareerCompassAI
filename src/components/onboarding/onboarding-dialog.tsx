'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import type { UserProfile, Skill } from '@/lib/types';
import { useUserProfile } from '@/hooks/use-user-profile';

const proficiencyLevels = {
  0: 'Beginner',
  25: 'Familiar',
  50: 'Intermediate',
  75: 'Proficient',
  100: 'Expert',
};

export function OnboardingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setUserProfile } = useUserProfile();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentProficiency, setCurrentProficiency] = useState(50);

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.find((s) => s.name.toLowerCase() === currentSkill.trim().toLowerCase())) {
      setSkills([
        ...skills,
        { name: currentSkill.trim(), proficiency: currentProficiency },
      ]);
      setCurrentSkill('');
      setCurrentProficiency(50);
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };
  
  const handleFinish = () => {
    const profile: UserProfile = { name, bio, skills };
    setUserProfile(profile);
    onOpenChange(false);
    // Reset state for next time
    setTimeout(() => {
        setStep(1);
        setName('');
        setBio('');
        setSkills([]);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Welcome to CareerCompassAI</DialogTitle>
          <DialogDescription>
            Let's set up your profile to get personalized recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-headline">Step 1: About You</h3>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio & Interests</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your professional interests, hobbies, or what you're looking to achieve."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-headline">Step 2: Your Skills</h3>
              <div className="space-y-4 rounded-lg border p-4">
                 <div className="grid gap-2">
                    <Label htmlFor="skill">Add a skill</Label>
                    <div className="flex gap-2">
                        <Input
                            id="skill"
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            placeholder="e.g. React, Project Management"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                        />
                         <Button onClick={handleAddSkill} size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
                    </div>
                 </div>
                 <div className="grid gap-2">
                    <Label>Proficiency: <span className="text-primary font-bold">{proficiencyLevels[currentProficiency as keyof typeof proficiencyLevels]}</span></Label>
                    <Slider
                        value={[currentProficiency]}
                        onValueChange={(value) => setCurrentProficiency(value[0])}
                        max={100}
                        step={25}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                <Label>Your Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No skills added yet.</p>
                  ) : (
                    skills.map((skill) => (
                      <Badge key={skill.name} variant="secondary" className="text-base py-1 pl-3 pr-2">
                        {skill.name}
                        <button onClick={() => handleRemoveSkill(skill.name)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between w-full">
            <div>
                 <p className="text-sm text-muted-foreground">Step {step} of 2</p>
            </div>
            <div className="flex gap-2">
                {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(step - 1)}>
                        Back
                    </Button>
                )}
                {step < 2 ? (
                    <Button onClick={() => setStep(step + 1)} disabled={!name}>
                        Next
                    </Button>
                ) : (
                    <Button onClick={handleFinish} disabled={skills.length === 0}>
                        Finish
                    </Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
