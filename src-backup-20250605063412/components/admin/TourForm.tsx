'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X } from 'lucide-react';

const tourSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
  price: z.number().min(1, 'Price must be greater than 0'),
  discountPrice: z.number().optional(),
  maxGroupSize: z.number().min(1, 'Group size must be at least 1'),
  difficulty: z.enum(['easy', 'medium', 'difficult']),
  status: z.enum(['draft', 'published', 'archived']),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  highlights: z.array(z.string()).min(1, 'At least one highlight is required'),
  included: z.array(z.string()).min(1, 'At least one inclusion is required'),
  excluded: z.array(z.string()).optional(),
  itinerary: z.array(
    z.object({
      day: z.number().min(1, 'Day number is required'),
      title: z.string().min(3, 'Title is required'),
      description: z.string().min(10, 'Description is required'),
      accommodation: z.string().optional(),
      meals: z.array(z.string()).optional(),
    })
  ).min(1, 'At least one day is required'),
});

type TourFormValues = z.infer<typeof tourSchema>;

interface TourFormProps {
  initialData?: any;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export function TourForm({ initialData, isEditing = false, onSuccess }: TourFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      description: '',
      duration: 1,
      price: 0,
      maxGroupSize: 8,
      difficulty: 'medium',
      status: 'draft',
      category: '',
      images: [],
      highlights: [''],
      included: [''],
      excluded: [],
      itinerary: [
        {
          day: 1,
          title: '',
          description: '',
          meals: [],
        },
      ],
    },
  });

  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = form;

  const onSubmit = async (data: TourFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const url = isEditing 
        ? `/api/admin/tours/${initialData.id}`
        : '/api/admin/tours';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
      
      const result = await response.json();
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/tours');
        router.refresh();
      }
      
      return result;
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for title changes to auto-generate slug
  const title = watch('title');
  useEffect(() => {
    if (!isEditing && title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setValue('slug', slug);
    }
  }, [title, isEditing, setValue]);

  // Handle adding new fields to array fields
  const addField = (field: 'highlights' | 'included' | 'excluded' | 'itinerary') => {
    const currentValue = form.getValues(field) || [];
    
    if (field === 'itinerary') {
      // For itinerary, add a new day object
      form.setValue('itinerary', [
        ...(currentValue as Array<{
          day: number;
          title: string;
          description: string;
          meals: string[];
          accommodation?: string;
        }>),
        { 
          day: currentValue.length + 1, 
          title: '', 
          description: '', 
          meals: [],
          accommodation: ''
        },
      ]);
    } else {
      // For string arrays (highlights, included, excluded)
      form.setValue(field, [...(currentValue as string[]), '']);
    }
  };

  // Handle removing fields from string array fields (highlights, included, excluded)
  const removeStringField = (field: 'highlights' | 'included' | 'excluded', index: number) => {
    const currentValue = form.getValues(field) || [];
    const newValue = [...currentValue];
    newValue.splice(index, 1);
    form.setValue(field, newValue);
  };

  // Handle removing itinerary day
  const removeItineraryDay = (index: number) => {
    const currentItinerary = form.getValues('itinerary') || [];
    const newItinerary = [...currentItinerary];
    newItinerary.splice(index, 1);
    form.setValue('itinerary', newItinerary);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="relative rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Basic Information</h2>
          
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="e.g. 7-Day Kilimanjaro Climb"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="e.g. 7-day-kilimanjaro-climb"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={4}
              placeholder="Enter a detailed description of the tour..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                {...register('duration', { valueAsNumber: true })}
                min={1}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="maxGroupSize">Max Group Size</Label>
              <Input
                id="maxGroupSize"
                type="number"
                {...register('maxGroupSize', { valueAsNumber: true })}
                min={1}
              />
              {errors.maxGroupSize && (
                <p className="mt-1 text-sm text-red-600">{errors.maxGroupSize.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                min={0}
                step={0.01}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="discountPrice">Discount Price ($)</Label>
              <Input
                id="discountPrice"
                type="number"
                {...register('discountPrice', { valueAsNumber: true })}
                min={0}
                step={0.01}
              />
              {errors.discountPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.discountPrice.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="difficult">Difficult</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...register('category')}
              placeholder="e.g. Hiking, Safari, Beach"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
        </div>
        
        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Images</h2>
          <div className="space-y-2">
            <Label>Upload Images</Label>
            <div className="flex w-full items-center justify-center">
              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <svg className="mb-4 h-8 w-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" multiple />
              </label>
            </div>
            {errors.images && (
              <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
            )}
          </div>
          
          {/* Highlights */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Highlights</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addField('highlights')}
              >
                Add Highlight
              </Button>
            </div>
            {watch('highlights')?.map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  {...register(`highlights.${index}` as const)}
                  placeholder="Enter a highlight"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStringField('highlights', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.highlights && (
              <p className="mt-1 text-sm text-red-600">{errors.highlights.message}</p>
            )}
          </div>
          
          {/* Included */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Included</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addField('included')}
              >
                Add Inclusion
              </Button>
            </div>
            {watch('included')?.map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  {...register(`included.${index}` as const)}
                  placeholder="Enter what's included"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStringField('included', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.included && (
              <p className="mt-1 text-sm text-red-600">{errors.included.message}</p>
            )}
          </div>
          
          {/* Excluded */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Excluded (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addField('excluded')}
              >
                Add Exclusion
              </Button>
            </div>
            {watch('excluded')?.map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  {...register(`excluded.${index}` as const)}
                  placeholder="Enter what's not included"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStringField('excluded', index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.excluded && (
              <p className="mt-1 text-sm text-red-600">{errors.excluded.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Itinerary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Itinerary</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addField('itinerary')}
          >
            Add Day
          </Button>
        </div>
        
        {watch('itinerary')?.map((day, index) => (
          <div key={index} className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Day {day.day}</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItineraryDay(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div>
              <Label htmlFor={`itinerary.${index}.title`}>Title</Label>
              <Input
                id={`itinerary.${index}.title`}
                {...register(`itinerary.${index}.title` as const)}
                placeholder="Day title"
              />
              {errors.itinerary?.[index]?.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.itinerary[index]?.title?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor={`itinerary.${index}.description`}>Description</Label>
              <Textarea
                id={`itinerary.${index}.description`}
                {...register(`itinerary.${index}.description` as const)}
                rows={3}
                placeholder="Day description"
              />
              {errors.itinerary?.[index]?.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.itinerary[index]?.description?.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor={`itinerary.${index}.accommodation`}>
                Accommodation (Optional)
              </Label>
              <Input
                id={`itinerary.${index}.accommodation`}
                {...register(`itinerary.${index}.accommodation` as const)}
                placeholder="Accommodation details"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Meals (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const meals = form.getValues(`itinerary.${index}.meals`) || [];
                    form.setValue(`itinerary.${index}.meals`, [...meals, '']);
                  }}
                >
                  Add Meal
                </Button>
              </div>
              
              {watch(`itinerary.${index}.meals`)?.map((_, mealIndex) => (
                <div key={mealIndex} className="flex items-center space-x-2">
                  <Input
                    {...register(`itinerary.${index}.meals.${mealIndex}` as const)}
                    placeholder="Meal details"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const meals = form.getValues(`itinerary.${index}.meals`) || [];
                      const newMeals = [...meals];
                      newMeals.splice(mealIndex, 1);
                      form.setValue(`itinerary.${index}.meals`, newMeals);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {errors.itinerary && (
          <p className="mt-1 text-sm text-red-600">{errors.itinerary.message}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/tours')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Tour' : 'Create Tour'}
        </Button>
      </div>
    </form>
  );
}
