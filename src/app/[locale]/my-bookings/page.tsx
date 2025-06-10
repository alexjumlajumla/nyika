import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function MyBookingsPage() {
  const t = await getTranslations('MyBookings');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('newBooking')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('upcomingTrips')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t('noUpcomingTrips')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// This helps with static optimization
MyBookingsPage.displayName = 'MyBookingsPage';
