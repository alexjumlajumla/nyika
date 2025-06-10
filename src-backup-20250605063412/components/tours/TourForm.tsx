'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/FileUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Tour } from '@prisma/client';

const tourFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 day'),
  maxGroupSize: z.coerce.number().min(1, 'Group size must be at least 1'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'DIFFICULT']),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  discount: z.coerce.number().min(0).max(100).optional(),
  imageCover: z.string().url('Please upload an image'),
  images: z.array(z.string().url()).default([]),
  startLocation: z.object({
    address: z.string().min(1, 'Address is required'),
    description: z.string().min(1, 'Description is required'),
    coordinates: z.array(z.number()).length(2).optional(),
  }),
  locations: z.array(
    z.object({
      day: z.number().min(1, 'Day must be at least 1'),
      description: z.string().min(1, 'Description is required'),
      coordinates: z.array(z.number()).length(2).optional(),
    })
  ),
  startDates: z.array(z.string().datetime()).default([]),
  secretTour: z.boolean().default(false),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

interface TourFormProps {
  initialData?: Tour & {
    categories: { id: string }[];
  };
  categories: Array<{ id: string; name: string }>;
}

export function TourForm({ initialData, categories }: TourFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          categories: initialData.categories?.map((c) => c.id) || [],
          startLocation: initialData.startLocation as any,
          locations: initialData.locations as any,
        }
      : {
          title: '',
          slug: '',
          description: '',
          summary: '',
          duration: 1,
          maxGroupSize: 10,
          difficulty: 'MEDIUM',
          price: 0,
          discount: 0,
          imageCover: '',
          images: [],
          startLocation: {
            address: '',
            description: '',
            coordinates: [],
          },
          locations: [
            {
              day: 1,
              description: '',
              coordinates: [],
            },
          ],
          startDates: [],
          secretTour: false,
          categories: [],
        },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TourFormValues) => {
    try {
      const url = isEdit
        ? `/api/tours/${initialData.id}`
        : '/api/tours';
      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

      router.push(`/tours/${result.slug}`);
      router.refresh();
    } catch (error) {
      console.error('Error saving tour:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amazing Safari Adventure"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                    <Input
                      placeholder="amazing-safari-adventure"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The URL-friendly version of the title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of the tour"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the tour"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageCover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder="nyika-safaris/tours"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Images</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={(urls) => field.onChange(Array.isArray(urls) ? urls : [urls])}
                      folder="nyika-safaris/tours"
                      multiple
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === '' ? 0 : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Start Location</h3>
              <div className="space-y-4 rounded-md border p-4">
                <FormField
                  control={form.control}
                  name="startLocation.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Safari Street, Nairobi, Kenya"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startLocation.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Meeting point at the main entrance"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Itinerary</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const locations = form.getValues('locations');
                    form.setValue('locations', [
                      ...locations,
                      {
                        day: locations.length + 1,
                        description: '',
                        coordinates: [],
                      },
                    ]);
                  }}
                >
                  Add Day
                </Button>
              </div>

              <div className="space-y-4">
                {form.watch('locations').map((_, index) => (
                  <div
                    key={index}
                    className="space-y-4 rounded-md border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Day {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            const locations = form.getValues('locations');
                            form.setValue(
                              'locations',
                              locations.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`locations.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder={`Describe day ${index + 1} activities`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="categories"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={category.id}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value?.includes(category.id)}
                                  onChange={(e) => {
                                    return e.target.checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          category.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== category.id
                                          ) ?? []
                                        );
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {category.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secretTour"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Secret Tour</FormLabel>
                    <FormDescription>
                      When enabled, this tour will be hidden from the main
                      listings.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Tour'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
