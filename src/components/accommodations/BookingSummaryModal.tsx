'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils/format';
import { useTranslations } from 'next-intl';

interface BookingSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roomName: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  nights: number;
  roomPrice: number;
  serviceFee: number;
  serviceFeeEnabled: boolean;
  adults: number;
  children: number;
  specialRequests: string;
  isLoading?: boolean;
}

export function BookingSummaryModal({
  isOpen,
  onClose,
  onConfirm,
  roomName,
  checkIn,
  checkOut,
  nights,
  roomPrice,
  serviceFee,
  serviceFeeEnabled,
  adults,
  children,
  specialRequests,
  isLoading = false,
}: BookingSummaryModalProps) {
  const t = useTranslations('accommodation.booking');
  
  if (!isOpen) return null;

  const subtotal = roomPrice * nights;
  const total = serviceFeeEnabled ? subtotal + serviceFee : subtotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl relative overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-amber-100/10 dark:from-amber-900/10 dark:to-amber-800/5 -z-10" />
        
        <CardHeader className="border-b border-white/10">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('bookingSummary')}
            </CardTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Booking Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {roomName}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">{t('checkIn')}</p>
                  <p>{checkIn?.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">{t('checkOut')}</p>
                  <p>{checkOut?.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">{t('guests')}</p>
                  <p>{adults} {t('adults')} {children > 0 ? `, ${children} ${t('children')}` : ''}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">{t('nights')}</p>
                  <p>{nights}</p>
                </div>
              </div>
              
              {specialRequests && (
                <div className="mt-4">
                  <p className="font-medium text-gray-500 dark:text-gray-400">{t('specialRequests')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{specialRequests}</p>
                </div>
              )}
            </div>
            
            {/* Price Breakdown */}
            <div className="border-t border-white/10 pt-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">{t('priceBreakdown')}</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatPrice(roomPrice)} × {nights} {t('nights')}
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                {serviceFeeEnabled && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('serviceFee')}
                    </span>
                    <span className="font-medium">{formatPrice(serviceFee)}</span>
                  </div>
                )}
                
                <div className="border-t border-white/10 pt-2 mt-3 flex justify-between font-semibold text-base">
                  <span>{t('total')}</span>
                  <span className="text-amber-600 dark:text-amber-400">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                {t('back')}
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('processing')}
                  </>
                ) : (
                  <>{t('confirmBooking')}</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
