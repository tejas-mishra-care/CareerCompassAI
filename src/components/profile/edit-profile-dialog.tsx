
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAuth, updateProfile } from 'firebase/auth';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/use-user-profile.tsx';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Edit, Loader2 } from 'lucide-react';
import { useFirebaseStorage } from '@/hooks/use-firebase-storage';
import { app } from '@/lib/firebase';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name must not be longer than 50 characters.' }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function EditProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user, userProfile, setUserProfile } = useUserProfile();
  const { toast } = useToast();
  const auth = getAuth(app);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { uploadFile, isUploading, error: uploadError } = useFirebaseStorage();


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({ name: userProfile.name });
    }
    if (user?.photoURL) {
      setPreview(user.photoURL);
    }
    setSelectedFile(null);
  }, [open, userProfile, user, form]);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !userProfile) return;

    try {
      let photoURL = user.photoURL;

      // 1. Upload new photo if one is selected
      if (selectedFile) {
        const filePath = `profile-pictures/${user.uid}/${selectedFile.name}`;
        photoURL = await uploadFile(filePath, selectedFile);
        if (!photoURL) {
          throw new Error(uploadError || 'File upload failed to return a URL.');
        }
      }
      
      // 2. Update Firebase Auth profile
      await updateProfile(auth.currentUser!, {
        displayName: data.name,
        photoURL: photoURL,
      });

      // 3. Update Firestore profile
      await setUserProfile({ ...userProfile, name: data.name });

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'An error occurred while saving your profile.',
      });
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : name[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 text-3xl">
                  <AvatarImage src={preview ?? undefined} alt="Profile preview" />
                  <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
                </Avatar>
                <label
                  htmlFor="photo-upload"
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                >
                  <Edit className="h-8 w-8 text-white" />
                </label>
                <Input
                  id="photo-upload"
                  type="file"
                  className="sr-only"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                {(form.formState.isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
