import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSubmitDirectorRegistrationV2 } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { isSameDay } from '../../utils/dateHelpers';

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
  email?: string;
  contactNumber?: string;
  currentCity?: string;
  department?: string;
  designation?: string;
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
  const submitMutation = useSubmitDirectorRegistrationV2();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [tribeCompanyName, setTribeCompanyName] = useState('');
  const [availabilityStart, setAvailabilityStart] = useState<Date | null>(null);
  const [availabilityEnd, setAvailabilityEnd] = useState<Date | null>(null);
  const [workReelUrl, setWorkReelUrl] = useState('');
  const [industryReference, setIndustryReference] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const isAuthenticated = !!identity;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!contactNumber.trim()) newErrors.contactNumber = 'Contact number is required.';
    if (!currentCity.trim()) newErrors.currentCity = 'Current city is required.';
    if (!department.trim()) newErrors.department = 'Department is required.';
    if (!designation.trim()) newErrors.designation = 'Designation is required.';
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
      newErrors.industryReference = 'Industry reference email is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate availability date strings from range
  const buildAvailabilityDates = (start: Date, end: Date): string[] => {
    const dates: string[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!validate()) return;
    if (!availabilityStart || !availabilityEnd) return;

    const availability = buildAvailabilityDates(availabilityStart, availabilityEnd);

    await submitMutation.mutateAsync({
      fullName: fullName.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      city: currentCity.trim(),
      department: department.trim(),
      designation: designation.trim(),
      yearsOfExperience: BigInt(parseInt(yearsOfExperience, 10)),
      tribeCompanyName: tribeCompanyName.trim(),
      role: 'Director',
      executiveProducers: [],
      workReelUrl: workReelUrl.trim(),
      industryReferenceEmail: industryReference.trim(),
      availability,
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
        <input
          id="dir-fullname"
          type="text"
          placeholder="e.g. Arjun Mehta"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.fullName ? 'border-destructive' : 'border-input'}`}
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-email">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <input
          id="dir-email"
          type="email"
          placeholder="e.g. arjun@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.email ? 'border-destructive' : 'border-input'}`}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      {/* Contact Number */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-contact">
          Contact Number <span className="text-destructive">*</span>
        </Label>
        <input
          id="dir-contact"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.contactNumber ? 'border-destructive' : 'border-input'}`}
        />
        {errors.contactNumber && <p className="text-xs text-destructive">{errors.contactNumber}</p>}
      </div>

      {/* Current City */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-city">
          Current City <span className="text-destructive">*</span>
        </Label>
        <input
          id="dir-city"
          type="text"
          placeholder="e.g. Mumbai"
          value={currentCity}
          onChange={(e) => setCurrentCity(e.target.value)}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.currentCity ? 'border-destructive' : 'border-input'}`}
        />
        {errors.currentCity && <p className="text-xs text-destructive">{errors.currentCity}</p>}
      </div>

      {/* Department */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-department">
          Department <span className="text-destructive">*</span>
        </Label>
        <input
          id="dir-department"
          type="text"
          placeholder="e.g. Creative, Production"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.department ? 'border-destructive' : 'border-input'}`}
        />
        {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
      </div>

      {/* Designation */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-designation">
          Designation <span className="text-destructive">*</span>
        </Label>
        <input
          id="dir-designation"
          type="text"
          placeholder="e.g. Director, Cinematographer"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.designation ? 'border-destructive' : 'border-input'}`}
        />
        {errors.designation && <p className="text-xs text-destructive">{errors.designation}</p>}
      </div>

      {/* Years of Experience */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-years">
          Years of Experience <span className="text-destructive">*</span>
        </Label>
        <input
          id="dir-years"
          type="number"
          min="0"
          max="60"
          placeholder="e.g. 8"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.yearsOfExperience ? 'border-destructive' : 'border-input'}`}
        />
        {errors.yearsOfExperience && (
          <p className="text-xs text-destructive">{errors.yearsOfExperience}</p>
        )}
      </div>

      {/* Tribe / Company Name */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-tribe">Tribe / Company Name</Label>
        <input
          id="dir-tribe"
          type="text"
          placeholder="e.g. Tribal Films"
          value={tribeCompanyName}
          onChange={(e) => setTribeCompanyName(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Availability Range */}
      <div className="space-y-2">
        <Label>
          Availability Range <span className="text-destructive">*</span>
        </Label>
        <div className="border border-border rounded-xl p-4 bg-background">
          <DateRangePicker
            startDate={availabilityStart}
            endDate={availabilityEnd}
            onChange={(s, e) => {
              setAvailabilityStart(s);
              setAvailabilityEnd(e);
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
        <input
          id="dir-reel"
          type="url"
          placeholder="https://vimeo.com/your-reel"
          value={workReelUrl}
          onChange={(e) => setWorkReelUrl(e.target.value)}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.workReelUrl ? 'border-destructive' : 'border-input'}`}
        />
        {errors.workReelUrl && <p className="text-xs text-destructive">{errors.workReelUrl}</p>}
      </div>

      {/* Industry Reference Email */}
      <div className="space-y-1.5">
        <Label htmlFor="dir-ref">
          Industry Reference Official Email ID <span className="text-destructive">*</span>
        </Label>
        <input
          id="dir-ref"
          type="email"
          placeholder="reference@agency.com"
          value={industryReference}
          onChange={(e) => setIndustryReference(e.target.value)}
          className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.industryReference ? 'border-destructive' : 'border-input'}`}
        />
        {errors.industryReference && (
          <p className="text-xs text-destructive">{errors.industryReference}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={submitMutation.isPending || loginStatus === 'logging-in'}
        className="w-full bg-saffron hover:bg-saffron-dark text-forest-deep border-0 shadow-saffron font-semibold text-base py-3 h-auto"
      >
        {submitMutation.isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4" />
            Submitting…
          </span>
        ) : !isAuthenticated ? (
          'Login to Register'
        ) : (
          'Submit Registration'
        )}
      </Button>

      {submitMutation.isError && (
        <p className="text-xs text-destructive text-center">
          {submitMutation.error?.message ?? 'Submission failed. Please try again.'}
        </p>
      )}
    </form>
  );
}
