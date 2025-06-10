'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';

// Define the profile schema
const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  title: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string(),
  locale: z.string(),
  bio: z.string().optional(),
  website: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  metadata: z.record(z.any()).optional()
}).refine(data => {
  // Skip email validation if it's not present in the form data
  if (data.email === undefined) return true;
  return z.string().email().safeParse(data.email).success;
}, {
  message: 'Invalid email address',
  path: ['email']
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      email: '',
      bio: '',
      website: '',
      company: '',
      title: '',
      location: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: 'en-US',
      metadata: {}
    }
  });
  
  const { register, handleSubmit, formState: { errors }, setValue } = form;
  const timezones = Intl.supportedValuesOf('timeZone');
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  // Fetch profile and session data
  useEffect(() => {
    const fetchProfileAndSession = async () => {
      try {
        setIsLoading(true);
        
        // Fetch session data first to get the current email
        const sessionResponse = await fetch('/api/auth/session');
        if (!sessionResponse.ok) {
          throw new Error('Failed to fetch session');
        }
        const sessionData = await sessionResponse.json();
        const currentEmail = sessionData.user?.email;
        
        if (!currentEmail) {
          throw new Error('No active session found. Please log in again.');
        }
        
        setSessionEmail(currentEmail);
        setValue('email', currentEmail);
        
        // Fetch profile data
        const profileResponse = await fetch('/api/profile');
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }
        const profileData = await profileResponse.json();
        
        // Set form values from profile data
        Object.entries(profileData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            setValue(key as keyof ProfileFormValues, value as any);
          }
        });
        
        // Ensure email is always set from session
        setValue('email', currentEmail);
        
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndSession();
  }, [setValue, toast]);

  const onSubmit = async (formData: ProfileFormValues) => {
    try {
      setIsSaving(true);
      
      // Create a clean copy of the data with only the fields we want to update
      const updateData = {
        full_name: formData.full_name,
        bio: formData.bio,
        website: formData.website,
        company: formData.company,
        title: formData.title,
        location: formData.location,
        timezone: formData.timezone,
        locale: formData.locale,
        metadata: formData.metadata
      };
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
      
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and settings
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Personal Information</h2>
              <p className="text-sm text-muted-foreground">
                Update your personal information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  placeholder="John Doe"
                  disabled={isSaving}
                />
                {errors.full_name && (
                  <p className="text-sm text-red-500">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={sessionEmail || ''}
                  placeholder="john@example.com"
                  readOnly
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <input type="hidden" {...register('email')} value={sessionEmail || ''} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Software Engineer"
                  disabled={isSaving}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="Your company"
                  disabled={isSaving}
                />
                {errors.company && (
                  <p className="text-sm text-red-500">{errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="City, Country"
                  disabled={isSaving}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  {...register('timezone')}
                  disabled={isSaving}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                {errors.timezone && (
                  <p className="text-sm text-red-500">{errors.timezone.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">About</h2>
              <p className="text-sm text-muted-foreground">
                Tell us about yourself
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Tell us a little bit about yourself"
                  className="min-h-[100px]"
                  disabled={isSaving}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  {...register('website')}
                  placeholder="https://example.com"
                  disabled={isSaving}
                />
                {errors.website && (
                  <p className="text-sm text-red-500">
                    {errors.website.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
