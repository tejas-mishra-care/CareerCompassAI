'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { OnboardingStepper } from './onboarding-stepper';


export function OnboardingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[600px] lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Welcome to CareerCompassAI</DialogTitle>
          <DialogDescription>
            Let's set up your profile to get personalized recommendations. This will just take a couple of minutes.
          </DialogDescription>
        </DialogHeader>
        <OnboardingStepper onFinish={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
