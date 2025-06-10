import { addDays, differenceInDays, isAfter, isBefore, isSameDay, parseISO } from 'date-fns';

export function calculateNights(checkIn: Date, checkOut: Date): number {
  return Math.max(0, differenceInDays(checkOut, checkIn));
}

export function calculateTotalPrice(
  basePrice: number,
  checkIn: Date,
  checkOut: Date,
  guestCount: number = 1,
  currencyCode: string = 'USD',
  rates: Record<string, number> = {}
): { total: number; nights: number; formattedTotal: string } {
  const nights = calculateNights(checkIn, checkOut);
  const total = basePrice * nights * guestCount;
  
  // Import formatCurrency dynamically to avoid circular dependencies
  const { formatCurrency } = require('./currency');
  
  return {
    total,
    nights,
    formattedTotal: formatCurrency(total, currencyCode as any, rates),
  };
}

export function getDisabledDates(bookings: Array<{ checkIn: string; checkOut: string }>): Date[] {
  const disabledRanges = bookings.map(booking => ({
    start: parseISO(booking.checkIn),
    end: parseISO(booking.checkOut),
  }));

  const disabledDates: Date[] = [];
  
  disabledRanges.forEach(({ start, end }) => {
    let current = start;
    while (isBefore(current, end) || isSameDay(current, end)) {
      disabledDates.push(current);
      current = addDays(current, 1);
    }
  });

  return disabledDates;
}

export function isDateRangeAvailable(
  checkIn: Date,
  checkOut: Date,
  disabledDates: Date[]
): boolean {
  if (isAfter(checkIn, checkOut)) return false;
  
  let current = checkIn;
  while (isBefore(current, checkOut) || isSameDay(current, checkOut)) {
    if (disabledDates.some(disabledDate => isSameDay(disabledDate, current))) {
      return false;
    }
    current = addDays(current, 1);
  }
  
  return true;
}
