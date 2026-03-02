import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSubmitDirectorRegistration } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { dateToTime, isSameDay } from '../../utils/dateHelpers';

// ── Date Range Picker ──────────────────────────────────────────────────────────

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoPrev = viewMonth > minMonth;
  const canGoNext = viewMonth < maxMonth;

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  const handleDayClick = (date: Date) => {
    if (selecting === 'start') {
      onChange(date, null);
      setSelecting('end');
    } else {
      if (startDate && date < startDate) {
        onChange(date, startDate);
      } else {
        onChange(startDate, date);
      }
      setSelecting('start');
    }
  };

  const cells: React.ReactElement[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`e-${i}`} className="aspect-square" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isStart = startDate ? isSameDay(date, startDate) : false;
    const isEnd = endDate ? isSameDay(date, endDate) : false;
    const inRange = isInRange(date);
    const isToday = isSameDay(date, today);
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    cells.push(
      <button
        key={d}
        type="button"
        disabled={isPast}
        onClick={() => handleDayClick(date)}
        className={`aspect-square rounded-lg border text-sm font-medium transition-all
          ${isPast ? 'opacity-30 cursor-not-allowed border-border' : 'cursor-pointer'}
          ${(isStart || isEnd) && !isPast ? 'bg-primary text-primary-foreground border-primary shadow-forest' : ''}
          ${inRange && !isPast ? 'bg-primary/20 border-primary/30' : ''}
          ${!isStart && !isEnd && !inRange && !isPast ? 'border-border hover:border-primary/50 hover:bg-primary/10' : ''}
          ${isToday && !isStart && !isEnd ? 'border-saffron border-2' : ''}
        `}
      >
        {d}
      </button>
    );
  }

  const formatShort = (d: Date | null) =>
    d
      ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '—';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={prevMonth}
          disabled={!canGoPrev}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-semibold text-foreground">
          {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={nextMonth}
          disabled={!canGoNext}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{cells}</div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
        <span>
          <span className="font-medium text-foreground">From:</span> {formatShort(startDate)}
        </span>
        <span className="text-border">|</span>
        <span>
          <span className="font-medium text-foreground">To:</span> {formatShort(endDate)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {selecting === 'start' ? 'Click to set start date' : 'Click to set end date'}
      </p>
    </div>
  );
}

// ── Form ──────────────────────────────────────────────────────────────────────

interface FormErrors {
  fullName?: string;
  currentCity?: string;
  yearsOfExperience?: string;
  availabilityRange?: string;
  workReelUrl?: string;
  industryReference?: string;
}

interface DirectorRegistrationFormProps {
  onSuccess: () => void;
}

export default function DirectorRegistrationForm({ onSuccess }: DirectorRegistrationFormProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const submitMutation = useSubmitDirectorRegistration();

  const [fullName, setFullName] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [productSpecialisation, setProductSpecialisation] = useState('');
  const [genreSpecialisation, setGenreSpecialisation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState<Date | null>(null);
  const [availabilityEnd, setAvailabilityEnd] = useState<Date | null>(null);
  const [workReelUrl, setWorkReelUrl] = useState('');
  const [industryReference, setIndustryReference] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const isAuthenticated = !!identity;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!currentCity.trim()) newErrors.currentCity = 'Current city is required.';
    const years = parseInt(yearsOfExperience, 10);
    if (!yearsOfExperience || isNaN(years) || years < 0) {
      newErrors.yearsOfExperience = 'Please enter a valid number of years.';
    }
    if (!availabilityStart || !availabilityEnd) {
      newErrors.availabilityRange = 'Please select a start and end date for your availability.';
    }
    if (!workReelUrl.trim()) {
      newErrors.workReelUrl = 'Work reel URL is required.';
    } else {
      try {
        new URL(workReelUrl);
      } catch {
        newErrors.workReelUrl = 'Please enter a valid URL (e.g. https://vimeo.com/...).';
      }
    }
    if (!industryReference.trim()) {
      newErrors.industryReference = 'Industry reference is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!validate()) return;
    if (!availabilityStart || !availabilityEnd) return;

    await submitMutation.mutateAsync({
      fullName: fullName.trim(),
      currentCity: currentCity.trim(),
      productSpecialisation: productSpecialisation.trim() || undefined,
      genreSpecialisation: genreSpecialisation.trim() || undefined,
      yearsOfExperience: BigInt(parseInt(yearsOfExperience, 10)),
      availabilityStart: dateToTime(availabilityStart),
      availabilityEnd: dateToTime(availabilityEnd),
      workReelUrl: workReelUrl.trim(),
      industryReference: industryReference.trim(),
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-fullname">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dir-fullname"
          placeholder="e.g. Arjun Mehta"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={errors.fullName ? 'border-destructive' : ''}
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      {/* Current City */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-city">
          Current City <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dir-city"
          placeholder="e.g. Mumbai"
          value={currentCity}
          onChange={(e) => setCurrentCity(e.target.value)}
          className={errors.currentCity ? 'border-destructive' : ''}
        />
        {errors.currentCity && (
          <p className="text-xs text-destructive">{errors.currentCity}</p>
        )}
      </div>

      {/* Product Specialisation (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-product-spec">
          Product Specialisation{' '}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </Label>
        <Input
          id="dir-product-spec"
          placeholder="e.g. FMCG, Automotive, Luxury Goods"
          value={productSpecialisation}
          onChange={(e) => setProductSpecialisation(e.target.value)}
        />
      </div>

      {/* Genre Specialisation (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-genre-spec">
          Genre Specialisation{' '}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </Label>
        <Input
          id="dir-genre-spec"
          placeholder="e.g. Narrative, Documentary, Comedy"
          value={genreSpecialisation}
          onChange={(e) => setGenreSpecialisation(e.target.value)}
        />
      </div>

      {/* Years of Experience */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-years">
          Years of Experience <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dir-years"
          type="number"
          min={0}
          placeholder="e.g. 8"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          className={errors.yearsOfExperience ? 'border-destructive' : ''}
        />
        {errors.yearsOfExperience && (
          <p className="text-xs text-destructive">{errors.yearsOfExperience}</p>
        )}
      </div>

      {/* Availability for Next Two Months — Date Range Picker */}
      <div className="space-y-2">
        <Label>
          Availability for Next Two Months{' '}
          <span className="text-destructive">*</span>
          <span className="text-muted-foreground text-xs font-normal ml-1">
            (select start then end date)
          </span>
        </Label>
        <div
          className={`border rounded-xl p-4 bg-background ${
            errors.availabilityRange ? 'border-destructive' : 'border-border'
          }`}
        >
          <DateRangePicker
            startDate={availabilityStart}
            endDate={availabilityEnd}
            onChange={(start, end) => {
              setAvailabilityStart(start);
              setAvailabilityEnd(end);
            }}
          />
        </div>
        {errors.availabilityRange && (
          <p className="text-xs text-destructive">{errors.availabilityRange}</p>
        )}
      </div>

      {/* Work Reel URL */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-reel">
          Work Reel URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dir-reel"
          type="url"
          placeholder="https://vimeo.com/your-reel"
          value={workReelUrl}
          onChange={(e) => setWorkReelUrl(e.target.value)}
          className={errors.workReelUrl ? 'border-destructive' : ''}
        />
        {errors.workReelUrl && (
          <p className="text-xs text-destructive">{errors.workReelUrl}</p>
        )}
      </div>

      {/* Industry Reference */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-reference">
          Industry Reference <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="dir-reference"
          placeholder="Names, companies, or contact details of professional references..."
          value={industryReference}
          onChange={(e) => setIndustryReference(e.target.value)}
          rows={3}
          className={errors.industryReference ? 'border-destructive' : ''}
        />
        {errors.industryReference && (
          <p className="text-xs text-destructive">{errors.industryReference}</p>
        )}
      </div>

      {/* Submission error */}
      {submitMutation.isError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">
          Something went wrong. Please try again.
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full font-semibold tracking-wide bg-saffron hover:bg-saffron-dark text-forest-deep border-0 shadow-saffron"
        disabled={submitMutation.isPending || loginStatus === 'logging-in'}
      >
        {submitMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : !isAuthenticated ? (
          'Login to Register'
        ) : (
          'Join the Tribe as Director'
        )}
      </Button>
    </form>
  );
}
