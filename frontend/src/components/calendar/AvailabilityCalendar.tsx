import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dateToTime, timeToDate, isSameDay } from '../../utils/dateHelpers';
import type { CalendarAvailability } from '../../backend';
import { Variant_booked_available_unavailable } from '../../backend';
import AvailabilityLegend from './AvailabilityLegend';
import React from 'react';

interface AvailabilityCalendarProps {
  availability: CalendarAvailability[];
  onAvailabilityChange: (availability: CalendarAvailability[]) => void;
  readOnly?: boolean;
}

export default function AvailabilityCalendar({
  availability,
  onAvailabilityChange,
  readOnly = false,
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getStatusForDate = (date: Date): Variant_booked_available_unavailable | null => {
    const entry = availability.find((a) => isSameDay(timeToDate(a.date), date));
    return entry ? entry.status : null;
  };

  const toggleDateStatus = (date: Date) => {
    if (readOnly) return;

    const currentStatus = getStatusForDate(date);
    let newStatus: Variant_booked_available_unavailable;

    if (currentStatus === null) {
      newStatus = Variant_booked_available_unavailable.available;
    } else if (currentStatus === Variant_booked_available_unavailable.available) {
      newStatus = Variant_booked_available_unavailable.booked;
    } else if (currentStatus === Variant_booked_available_unavailable.booked) {
      newStatus = Variant_booked_available_unavailable.unavailable;
    } else {
      const updatedAvailability = availability.filter((a) => !isSameDay(timeToDate(a.date), date));
      onAvailabilityChange(updatedAvailability);
      return;
    }

    const updatedAvailability = availability.filter((a) => !isSameDay(timeToDate(a.date), date));
    updatedAvailability.push({
      date: dateToTime(date),
      status: newStatus,
    });
    onAvailabilityChange(updatedAvailability);
  };

  const getStatusColor = (status: Variant_booked_available_unavailable | null) => {
    if (status === null) return 'bg-background hover:bg-accent';
    if (status === Variant_booked_available_unavailable.available) return 'bg-green-500/20 hover:bg-green-500/30';
    if (status === Variant_booked_available_unavailable.booked) return 'bg-amber-500/20 hover:bg-amber-500/30';
    return 'bg-red-500/20 hover:bg-red-500/30';
  };

  const days: React.ReactElement[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const status = getStatusForDate(date);
    const isToday = isSameDay(date, new Date());

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => toggleDateStatus(date)}
        disabled={readOnly}
        className={`aspect-square rounded-lg border transition-colors ${getStatusColor(status)} ${
          isToday ? 'border-primary border-2' : 'border-border'
        } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <span className="text-sm font-medium">{day}</span>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" size="icon" onClick={previousMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <Button type="button" variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="grid grid-cols-7 gap-2">{days}</div>

      {!readOnly && <AvailabilityLegend />}
    </div>
  );
}
