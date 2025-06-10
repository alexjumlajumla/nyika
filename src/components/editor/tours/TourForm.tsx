'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { Tour as TourType, Destination, TourCategory } from '@/types/database.types';

type Tour = TourType;

const requiredArraySchema = z.array(z.string().min(1, "Can't be empty"));

const tourFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  overview: z.string().default(''),
  highlights: requiredArraySchema.min(1, 'At least one highlight is required'),
  included: requiredArraySchema.min(1, 'At least one included item is required'),
  excluded: requiredArraySchema.min(1, 'At least one excluded item is required'),
  duration_days: z.number().min(1, 'Must be at least 1'),
  difficulty_level: z.enum(['Easy', 'Moderate', 'Challenging', 'Difficult']).default('Moderate'),
  destination_id: z.string().min(1, 'Destination is required'),
  category_id: z.string().nullable().default(null),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  featured_image: z.string().nullable().default(null),
  gallery: z.array(z.string()).default([]),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

interface TourFormProps {
  tourId: string;
}

export function TourForm({ tourId }: TourFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<TourCategory[]>([]);
  
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema) as Resolver<TourFormValues>,
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      overview: '',
      highlights: [''],
      included: [''],
      excluded: [''],
      duration_days: 1,
      difficulty_level: 'Moderate',
      destination_id: '',
      category_id: null,
      is_featured: false,
      is_active: true,
      featured_image: null,
      gallery: [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
  } = form;

  // Fetch tour and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch tour data
        const { data: tour, error: tourError } = await supabase
          .from('tours')
          .select('*')
          .eq('id', tourId)
          .single();

        if (tourError) throw tourError;

        // Reset form with tour data
        reset({
          ...tour,
          highlights: tour.highlights || [''],
          included: tour.included || [''],
          excluded: tour.excluded || [''],
          gallery: tour.gallery || [],
        });

        // Fetch destinations and categories
        const [destinationsRes, categoriesRes] = await Promise.all([
          supabase.from('destinations').select('*').order('name'),
          supabase.from('tour_categories').select('*').order('name'),
        ]);

        if (destinationsRes.data) setDestinations(destinationsRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);

      } catch (error: unknown) {
        console.error('Error fetching data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load tour data';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
        router.push('/editor/tours');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tourId, router, supabase, toast, reset]);

  const onSubmit = useCallback(async (data: TourFormValues) => {
    try {
      const { error } = await supabase
        .from('tours')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tourId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tour updated successfully!',
      });
    } catch (error: unknown) {
      console.error('Error updating tour:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update tour';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [supabase, tourId, toast]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, type: 'featured' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tours')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tours')
        .getPublicUrl(filePath);

      if (type === 'featured') {
        setValue('featured_image', publicUrl, { shouldDirty: true });
      } else {
        const currentGallery = watch('gallery') || [];
        setValue('gallery', [...currentGallery, publicUrl], { shouldDirty: true });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Reset the file input
      if (e.target) {
        e.target.value = '';
      }
    }
  }, [supabase, setValue, watch, toast]);

  const removeImage = useCallback(
    (type: 'featured' | 'gallery', index?: number) => {
      if (type === 'featured') {
        setValue('featured_image', null, { shouldDirty: true });
      } else if (index !== undefined) {
        const currentGallery = watch('gallery');
        const newGallery = currentGallery.filter((_, i) => i !== index);
        setValue('gallery', newGallery, { shouldDirty: true });
      }
    },
    [setValue, watch]
  );
    

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <FormInput
                    id="title"
                    {...register('title')}
                    error={errors.title?.message}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <FormInput
                    id="slug"
                    {...register('slug')}
                    error={errors.slug?.message}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  className={errors.description ? 'border-red-500' : ''}
                  {...register('description')}
                  rows={3}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="overview">Overview</Label>
                <div className="space-y-1">
                  <Textarea
                    id="overview"
                    className={errors.overview ? 'border-red-500' : ''}
                    {...register('overview')}
                    rows={5}
                  />
                  {errors.overview && (
                    <p className="text-sm text-red-500">{errors.overview.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tour Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="duration_days">Duration (Days) *</Label>
                  <FormInput
                    id="duration_days"
                    type="number"
                    min="1"
                    {...register('duration_days', { valueAsNumber: true })}
                    error={errors.duration_days?.message}
                  />
                </div>
                
                <div>
                  <Label htmlFor="difficulty_level">Difficulty Level</Label>
                  <select
                    id="difficulty_level"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('difficulty_level')}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Difficult">Difficult</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="destination_id">Destination *</Label>
                  <select
                    id="destination_id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('destination_id')}
                  >
                    <option value="">Select a destination</option>
                    {destinations.map((dest) => (
                      <option key={dest.id} value={dest.id}>
                        {dest.name}
                      </option>
                    ))}
                  </select>
                  {errors.destination_id && (
                    <p className="mt-1 text-sm font-medium text-destructive">
                      {errors.destination_id.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Highlights</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentHighlights = watch('highlights') || [];
                      setValue('highlights', [...currentHighlights, '']);
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Highlight
                  </Button>
                </div>
                
                {watch('highlights')?.map((highlight, index) => (
                  <div key={index} className="mb-2 flex gap-2">
                    <FormInput
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...(watch('highlights') || [])];
                        newHighlights[index] = e.target.value;
                        setValue('highlights', newHighlights);
                      }}
                      error={errors.highlights?.[index]?.message}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newHighlights = [...(watch('highlights') || [])];
                        newHighlights.splice(index, 1);
                        setValue('highlights', newHighlights);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  {...register('is_featured')}
                />
                <Label htmlFor="is_featured">Featured Tour</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  {...register('is_active')}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Featured Image</Label>
                <div className="mt-2">
                  {watch('featured_image') ? (
                    <div className="group relative">
                      <img
                        src={watch('featured_image') || ''}
                        alt="Featured tour"
                        className="h-48 w-full rounded-md object-cover"
                        width={400}
                        height={300}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeImage('featured')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex w-full items-center justify-center">
                      <label
                        htmlFor="featured-upload"
                        className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                          <ImageIcon className="mb-2 h-8 w-8 text-gray-500" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                        </div>
                        <input
                          id="featured-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'featured')}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label>Gallery Images</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => handleImageUpload(e as any, 'gallery');
                      input.click();
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Image
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {watch('gallery')?.map((image, index) => (
                    <div key={index} className="group relative">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="h-32 w-full rounded-md object-cover"
                        width={200}
                        height={150}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute right-1 top-1 h-6 w-6 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeImage('gallery', index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
