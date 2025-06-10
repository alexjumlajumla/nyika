'use client';

import { useState } from 'react';
import { Star, StarHalf, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  user: {
    name: string;
    photo?: string;
  };
  rating: number;
  review: string;
  createdAt: string;
}

interface TourReviewsProps {
  tourId: string;
  initialReviews?: Review[];
  ratingsAverage?: number;
  ratingsQuantity?: number;
  className?: string;
}

export function TourReviews({
  tourId,
  initialReviews = [],
  ratingsAverage = 0,
  ratingsQuantity = 0,
  className,
}: TourReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!review.trim()) {
      toast({
        title: 'Error',
        description: 'Please write your review',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call to submit the review
      // const response = await fetch(`/api/tours/${tourId}/reviews`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ rating, review }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to submit review');
      // }
      // 
      // const data = await response.json();
      
      // For demo purposes, we'll just add it to the local state
      const newReview: Review = {
        id: `review-${Date.now()}`,
        user: {
          name: 'You',
        },
        rating,
        review,
        createdAt: new Date().toISOString(),
      };
      
      setReviews([newReview, ...reviews]);
      setReview('');
      setRating(5);
      
      toast({
        title: 'Success',
        description: 'Thank you for your review!',
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to render star rating UI
  const renderStars = (starsRating: number) => {
    const stars = [];
    const fullStars = Math.floor(starsRating);
    const hasHalfStar = starsRating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className="h-5 w-5 fill-current text-yellow-400"
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className="h-5 w-5 fill-current text-yellow-400"
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="h-5 w-5 fill-current text-gray-300 dark:text-gray-600"
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className={cn('mt-12', className)}>
      <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Reviews</h2>
          <div className="mt-2 flex items-center">
            <div className="mr-2 flex">
              {renderStars(ratingsAverage)}
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {ratingsAverage.toFixed(1)} · {ratingsQuantity} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-medium">Write a Review</h3>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <div className="mb-2 flex" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={star === rating}
                  aria-label={`Rate ${star} out of 5 (${star} star${star === 1 ? '' : 's'})`}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={cn(
                      'w-6 h-6',
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600 fill-current'
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {rating} out of 5
            </span>
          </div>
          <div className="mb-4">
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience to help other travelers..."
              rows={4}
              disabled={isSubmitting}
              className="w-full"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !review.trim()}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800"
            >
              <div className="flex items-start">
                <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  {review.user.photo ? (
                    <img
                      src={review.user.photo}
                      alt={review.user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{review.user.name}</h4>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {review.review}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
