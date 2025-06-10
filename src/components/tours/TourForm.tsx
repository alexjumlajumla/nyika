'use client';

import * as React from 'react';
import { ChangeEvent, ReactNode, useCallback } from 'react';
import { useForm, useFieldArray, useFormContext, Control, FieldValues, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';

// Import UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

// Import types and schemas
import { Tour, tourFormSchema, TourDifficulty } from '@/schemas/tour.schema';

// Helper function to extract category ID
function getCategoryId(category: string | { id: string }): string {
  return typeof category === 'string' ? category : category?.id || '';
}

type TourFormValues = z.infer<typeof tourFormSchema>;

interface ItineraryField {
  id?: string;
  day: number;
  title: string;
  description: string;
}

interface TourFormProps {
  initialData?: Partial<Tour>;
  categories: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

export function TourForm({ initialData, categories, onSuccess }: TourFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!initialData?.id;

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema) as any,
    defaultValues: {
      // Default values
      title: '',
      slug: '',
      description: '',
      duration: 1,
      maxGroupSize: 1,
      price: 0,
      images: [],
      highlights: [''],
      included: [''],
      excluded: [''],
      startLocation: '',
      endLocation: '',
      difficulty: 'MEDIUM',
      categories: [],
      itinerary: [
        {
          id: 'day-1',
          day: 1,
          title: 'Arrival',
          description: 'Arrive at the destination and check into your accommodation.'
        }
      ],
      discount: 0,
      originalPrice: 0,
      availableDates: [new Date().toISOString()],
      destinations: [],
      rating: 0,
      ratingsAverage: 0,
      ratingsQuantity: 0,
      reviews: 0,
      // Override with initialData if it exists
      ...(initialData && {
        ...initialData,
        categories: initialData.categories?.map(c => 
          typeof c === 'string' ? c : (c as unknown as { id: string }).id
        ) || [],
        highlights: initialData.highlights?.length ? initialData.highlights : [''],
        included: initialData.included?.length ? initialData.included : [''],
        excluded: initialData.excluded?.length ? initialData.excluded : [''],
        itinerary: initialData.itinerary?.length 
          ? initialData.itinerary 
          : [{ day: 1, title: '', description: '' }],
        availableDates: initialData.availableDates?.length 
          ? initialData.availableDates 
          : [new Date().toISOString()],
        images: initialData.images || [],
        destinations: initialData.destinations || [],
        rating: initialData.rating || 0,
        ratingsAverage: initialData.ratingsAverage || 0,
        ratingsQuantity: initialData.ratingsQuantity || 0,
        reviews: initialData.reviews || 0,
      })
    } as TourFormValues,
  });

  // Helper type for field arrays to avoid type assertions
  type FieldArrayProps = {
    control: Control<TourFormValues>;
    name: keyof TourFormValues;
  };

  // Define field array types
  interface ItineraryField {
    id: string;
    day: number;
    title: string;
    description: string;
  }

  // Field arrays with proper typing using type assertions
  // Define field arrays with proper typing
  // Use type assertion for useFieldArray to avoid TypeScript errors
  const highlightsFieldArray = useFieldArray({
    control: form.control as any,
    name: 'highlights',
  });
  const highlightFields = highlightsFieldArray.fields as Array<{ id: string; text: string }>;

  const includedFieldArray = useFieldArray({
    control: form.control as any,
    name: 'included',
  });
  const includedFields = includedFieldArray.fields as Array<{ id: string; text: string }>;

  const excludedFieldArray = useFieldArray({
    control: form.control as any,
    name: 'excluded',
  });
  const excludedFields = excludedFieldArray.fields as Array<{ id: string; text: string }>;

  const itineraryFieldArray = useFieldArray({
    control: form.control as any,
    name: 'itinerary',
  });
  const itineraryFields = itineraryFieldArray.fields as ItineraryField[];

  // Helper functions to handle field array operations with proper typing
  const handleAppendHighlight = (value: { text: string }) => {
    highlightsFieldArray.append({ 
      ...value, 
      id: `highlight-${Date.now()}` 
    } as any);
  };

  const handleRemoveHighlight = (index: number) => {
    highlightsFieldArray.remove(index);
  };

  const handleAppendIncluded = (value: { text: string }) => {
    includedFieldArray.append({ 
      ...value, 
      id: `included-${Date.now()}` 
    } as any);
  };

  const handleRemoveIncluded = (index: number) => {
    includedFieldArray.remove(index);
  };

  const handleAppendExcluded = (value: { text: string }) => {
    excludedFieldArray.append({ 
      ...value, 
      id: `excluded-${Date.now()}` 
    } as any);
  };

  const handleRemoveExcluded = (index: number) => {
    excludedFieldArray.remove(index);
  };

  const handleAppendItinerary = (value: Omit<ItineraryField, 'id'>) => {
    itineraryFieldArray.append({ 
      ...value, 
      id: `day-${Date.now()}` 
    } as any);
  };

  const handleRemoveItinerary = (index: number) => {
    itineraryFieldArray.remove(index);
  };

  const addItineraryDay = () => {
    const currentItinerary = (form.getValues('itinerary') as ItineraryField[]) || [];
    const newDay = currentItinerary.length > 0 
      ? Math.max(...currentItinerary.map((item) => item?.day || 0)) + 1 
      : 1;
    
    // Call handleAppendItinerary with new day data
    handleAppendItinerary({ 
      day: newDay, 
      title: `Day ${newDay}`, 
      description: '' 
    });
  };

  const onSubmit = async (values: TourFormValues) => {
    try {
      const url = isEdit ? `/api/tours/${initialData?.id}` : '/api/tours';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to save tour');
      }

      const result = await response.json();

      toast({
        title: isEdit ? 'Tour updated' : 'Tour created',
        description: isEdit
          ? 'Your tour has been updated successfully.'
          : 'Your tour has been created successfully.',
      });

      if (onSuccess) {
        onSuccess();
      } else if (!isEdit) {
        router.push(`/tours/${result.id}`);
      }
    } catch (error) {
      console.error('Error saving tour:', error);
      toast({
        title: 'Error',
        description: 'Failed to save tour. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const removeItineraryDay = (index: number) => {
    if (itineraryFields.length <= 1) return;
    
    // Remove the day at the specified index
    const updatedItinerary = [...itineraryFields];
    updatedItinerary.splice(index, 1);
    
    // Update day numbers after removal
    const renumberedItinerary = updatedItinerary.map((day, i) => ({
      ...day,
      day: i + 1,
    }));
    
    // Update the form with the renumbered itinerary
    form.setValue('itinerary', renumberedItinerary, { shouldValidate: true });
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    form.setValue('price', value);
    
    const originalPrice = form.getValues('originalPrice');
    if (originalPrice && originalPrice > value) {
      const discount = ((originalPrice - value) / originalPrice) * 100;
      form.setValue('discount', Math.round(discount));
    } else {
      form.setValue('discount', 0);
    }
  };

  const handleOriginalPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    form.setValue('originalPrice', value);
    
    const price = form.getValues('price');
    if (value > price) {
      const discount = ((value - price) / value) * 100;
      form.setValue('discount', Math.round(discount));
    } else {
      form.setValue('discount', 0);
    }
  };

  const isCategorySelected = useCallback((categoryId: string) => {
    const currentCategories = form.getValues('categories') || [];
    return currentCategories.some((cat: string | { id: string }) => {
      const categoryIdToCheck = typeof cat === 'string' ? cat : cat?.id;
      return categoryIdToCheck === categoryId;
    });
  }, [form]);

  const handleCategoryChange = useCallback((categoryId: string, checked: boolean) => {
    const currentCategories = form.getValues('categories') || [];
    let newCategories: string[] = [];

    if (Array.isArray(currentCategories)) {
      newCategories = currentCategories
        .map((cat: string | { id: string }) => (typeof cat === 'string' ? cat : cat?.id || ''))
        .filter(Boolean) as string[];
    }

    if (checked) {
      // Add the category if checked and not already present
      if (!newCategories.includes(categoryId)) {
        newCategories.push(categoryId);
      }
    } else {
      // Remove the category if unchecked
      newCategories = newCategories.filter((id: string) => id !== categoryId);
    }

    form.setValue('categories', newCategories, { shouldValidate: true });
  }, [form]);

  const renderItinerary = () => {
    const fields = form.watch('itinerary') || [];
    
    return (fields as Array<ItineraryField & { id?: string }>).map((field, idx) => {
      const dayNumber = field?.day ?? idx + 1;
      const fieldId = field?.id || `day-${idx}`;
      
      return (
        <div key={fieldId} className="mb-4 space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Day {dayNumber}</h4>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItinerary(idx)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
          <FormField
            control={form.control}
            name={`itinerary.${idx}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`itinerary.${idx}.day`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`itinerary.${idx}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Day description..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    });
  };

  return (
    <div className="space-y-8 p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="mb-4 text-sm text-red-600">
              {Object.entries(form.formState.errors).map(([key, error]) => (
                <div key={key}>{(error as { message: string })?.message}</div>
              ))}
            </div>
          )}
          {/* Basic Information */}
          <div className="space-y-6 rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Tour Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Safari Adventure" 
                        {...field} 
                        value={field.value || ''}
                        className="mt-1"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="tour-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed tour description..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overview</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief tour overview..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Pricing & Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Pricing & Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxGroupSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Group Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="DIFFICULT">Difficult</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>{String(form.formState.errors.difficulty?.message)}</FormMessage>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(e);
                          handlePriceChange(e as unknown as ChangeEvent<HTMLInputElement>);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          field.onChange(e);
                          handleOriginalPriceChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Tour'}
            </Button>
          </div>
        </form>
      </Form>
    </div>);
}
