import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isSameDay } from '../../utils/dateHelpers';
import React from 'react';

interface AvailabilityCalendarProps {
  /** Dates marked as available */
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  readOnly?: boolean;
}

export default function AvailabilityCalendar({
  selectedDates,
  onDatesChange,
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

  const isSelected = (date: Date): boolean => {
    return selectedDates.some((d) => isSameDay(d, date));
  };

  const toggleDate = (date: Date) => {
    if (readOnly) return;
    if (isSelected(date)) {
      onDatesChange(selectedDates.filter((d) => !isSameDay(d, date)));
    } else {
      onDatesChange([...selectedDates, date]);
    }
  };

  const days: React.ReactElement[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const selected = isSelected(date);
    const isToday = isSameDay(date, new Date());

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => toggleDate(date)}
        disabled={readOnly}
        className={`aspect-square rounded-lg border transition-colors text-sm font-medium
          ${selected ? 'bg-primary/20 border-primary text-primary' : 'bg-background hover:bg-accent border-border'}
          ${isToday ? 'border-primary border-2' : ''}
          ${readOnly ? 'cursor-default' : 'cursor-pointer'}
        `}
      >
        {day}
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

      {!readOnly && (
        <p className="text-xs text-muted-foreground">
          Click dates to toggle availability. {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected.
        </p>
      )}
    </div>
  );
}
