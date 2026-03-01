import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSubmitProfessionalRegistration } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { AreaOfExpertise, ProfessionalDesignation } from '../../backend';
import { dateToTime, isSameDay } from '../../utils/dateHelpers';

export const DEPARTMENTS: { value: AreaOfExpertise; label: string }[] = [
  { value: AreaOfExpertise.creative, label: 'Creative' },
  { value: AreaOfExpertise.production, label: 'Production' },
  { value: AreaOfExpertise.accountManagement, label: 'Account Management' },
  { value: AreaOfExpertise.strategy, label: 'Strategy' },
  { value: AreaOfExpertise.media, label: 'Media' },
  { value: AreaOfExpertise.postProduction, label: 'Post-Production' },
  { value: AreaOfExpertise.digital, label: 'Digital' },
  { value: AreaOfExpertise.pr, label: 'PR & Communications' },
  { value: AreaOfExpertise.research, label: 'Research & Planning' },
  { value: AreaOfExpertise.other, label: 'Other' },
];

export const DESIGNATIONS: { value: ProfessionalDesignation; label: string }[] = [
  { value: ProfessionalDesignation.director, label: 'Director' },
  { value: ProfessionalDesignation.producer, label: 'Producer' },
  { value: ProfessionalDesignation.artDirector, label: 'Art Director' },
  { value: ProfessionalDesignation.copywriter, label: 'Copywriter' },
  { value: ProfessionalDesignation.strategist, label: 'Strategist' },
  { value: ProfessionalDesignation.accountExecutive, label: 'Account Executive' },
  { value: ProfessionalDesignation.mediaPlanner, label: 'Media Planner' },
  { value: ProfessionalDesignation.editor, label: 'Editor' },
  { value: ProfessionalDesignation.cinematographer, label: 'Cinematographer' },
  { value: ProfessionalDesignation.designer, label: 'Designer' },
  { value: ProfessionalDesignation.other, label: 'Other' },
];

export function AvailabilityPicker({
  selectedDates,
  onChange,
}: {
  selectedDates: Date[];
  onChange: (dates: Date[]) => void;
}) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const toggleDate = (date: Date) => {
    const exists = selectedDates.some((d) => isSameDay(d, date));
    if (exists) {
      onChange(selectedDates.filter((d) => !isSameDay(d, date)));
    } else {
      onChange([...selectedDates, date]);
    }
  };

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoPrev = viewMonth > minMonth;
  const canGoNext = viewMonth < maxMonth;

  const cells: React.ReactElement[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`e-${i}`} className="aspect-square" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isSelected = selectedDates.some((sd) => isSameDay(sd, date));
    const isToday = isSameDay(date, today);
    const isPast =
      date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    cells.push(
      <button
        key={d}
        type="button"
        disabled={isPast}
        onClick={() => toggleDate(date)}
        className={`aspect-square rounded-lg border text-sm font-medium transition-all
          ${isPast ? 'opacity-30 cursor-not-allowed border-border' : 'cursor-pointer'}
          ${isSelected && !isPast ? 'bg-primary text-primary-foreground border-primary shadow-forest' : ''}
          ${!isSelected && !isPast ? 'border-border hover:border-primary/50 hover:bg-primary/10' : ''}
          ${isToday && !isSelected ? 'border-saffron border-2' : ''}
        `}
      >
        {d}
      </button>
    );
  }

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
      <p className="text-xs text-muted-foreground">
        {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  );
}

interface FormErrors {
  name?: string;
  currentCity?: string;
  areaOfExpertise?: string;
  professionalDesignation?: string;
  yearsOfExperience?: string;
  workReelURL?: string;
}

interface InlineRegistrationFormProps {
  onSuccess: () => void;
}

export default function InlineRegistrationForm({ onSuccess }: InlineRegistrationFormProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const submitMutation = useSubmitProfessionalRegistration();

  const [name, setName] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [areaOfExpertise, setAreaOfExpertise] = useState<AreaOfExpertise | ''>('');
  const [professionalDesignation, setProfessionalDesignation] = useState<
    ProfessionalDesignation | ''
  >('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [availabilityDates, setAvailabilityDates] = useState<Date[]>([]);
  const [workReelURL, setWorkReelURL] = useState('');
  const [industryReferences, setIndustryReferences] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const isAuthenticated = !!identity;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!currentCity.trim()) newErrors.currentCity = 'Current city is required.';
    if (!areaOfExpertise)
      newErrors.areaOfExpertise = 'Please select an advertising department.';
    if (!professionalDesignation)
      newErrors.professionalDesignation = 'Please select a designation.';
    const years = parseInt(yearsOfExperience, 10);
    if (!yearsOfExperience || isNaN(years) || years < 0) {
      newErrors.yearsOfExperience = 'Please enter a valid number of years.';
    }
    if (!workReelURL.trim()) {
      newErrors.workReelURL = 'Work reel URL is required.';
    } else {
      try {
        new URL(workReelURL);
      } catch {
        newErrors.workReelURL = 'Please enter a valid URL (e.g. https://vimeo.com/...).';
      }
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
    if (!areaOfExpertise || !professionalDesignation) return;

    const availability = availabilityDates.map((d) => dateToTime(d));

    await submitMutation.mutateAsync({
      name: name.trim(),
      currentCity: currentCity.trim(),
      areaOfExpertise: areaOfExpertise as AreaOfExpertise,
      professionalDesignation: professionalDesignation as ProfessionalDesignation,
      yearsOfExperience: BigInt(parseInt(yearsOfExperience, 10)),
      availability,
      workReelURL: workReelURL.trim(),
      industryReferences: industryReferences.trim() || undefined,
      principal: identity!.getPrincipal(),
    });

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="inline-name">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="inline-name"
          placeholder="e.g. Alex Rivera"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* Current City */}
      <div className="space-y-1.5">
        <Label htmlFor="inline-city">
          Current City <span className="text-destructive">*</span>
        </Label>
        <Input
          id="inline-city"
          placeholder="e.g. Mumbai"
          value={currentCity}
          onChange={(e) => setCurrentCity(e.target.value)}
          className={errors.currentCity ? 'border-destructive' : ''}
        />
        {errors.currentCity && (
          <p className="text-xs text-destructive">{errors.currentCity}</p>
        )}
      </div>

      {/* Advertising Department */}
      <div className="space-y-1.5">
        <Label htmlFor="inline-department">
          Advertising Department <span className="text-destructive">*</span>
        </Label>
        <Select
          value={areaOfExpertise}
          onValueChange={(val) => setAreaOfExpertise(val as AreaOfExpertise)}
        >
          <SelectTrigger
            id="inline-department"
            className={errors.areaOfExpertise ? 'border-destructive' : ''}
          >
            <SelectValue placeholder="Select your department" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept.value} value={dept.value}>
                {dept.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.areaOfExpertise && (
          <p className="text-xs text-destructive">{errors.areaOfExpertise}</p>
        )}
      </div>

      {/* Professional Designation */}
      <div className="space-y-1.5">
        <Label htmlFor="inline-designation">
          Professional Designation <span className="text-destructive">*</span>
        </Label>
        <Select
          value={professionalDesignation}
          onValueChange={(val) =>
            setProfessionalDesignation(val as ProfessionalDesignation)
          }
        >
          <SelectTrigger
            id="inline-designation"
            className={errors.professionalDesignation ? 'border-destructive' : ''}
          >
            <SelectValue placeholder="Select your designation" />
          </SelectTrigger>
          <SelectContent>
            {DESIGNATIONS.map((des) => (
              <SelectItem key={des.value} value={des.value}>
                {des.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.professionalDesignation && (
          <p className="text-xs text-destructive">{errors.professionalDesignation}</p>
        )}
      </div>

      {/* Years of Experience */}
      <div className="space-y-1.5">
        <Label htmlFor="inline-years">
          Years of Experience in Present Designation{' '}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="inline-years"
          type="number"
          min={0}
          placeholder="e.g. 5"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          className={errors.yearsOfExperience ? 'border-destructive' : ''}
        />
        {errors.yearsOfExperience && (
          <p className="text-xs text-destructive">{errors.yearsOfExperience}</p>
        )}
      </div>

      {/* Availability Calendar */}
      <div className="space-y-2">
        <Label>
          Availability for Next Two Months{' '}
          <span className="text-muted-foreground text-xs font-normal">
            (tap dates to mark available)
          </span>
        </Label>
        <div className="border border-border rounded-xl p-4 bg-background">
          <AvailabilityPicker
            selectedDates={availabilityDates}
            onChange={setAvailabilityDates}
          />
        </div>
      </div>

      {/* Work Reel URL */}
      <div className="space-y-1.5">
        <Label htmlFor="inline-reel">
          Work Reel URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="inline-reel"
          type="url"
          placeholder="https://vimeo.com/your-reel"
          value={workReelURL}
          onChange={(e) => setWorkReelURL(e.target.value)}
          className={errors.workReelURL ? 'border-destructive' : ''}
        />
        {errors.workReelURL && (
          <p className="text-xs text-destructive">{errors.workReelURL}</p>
        )}
      </div>

      {/* Industry References (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="inline-references">
          Industry References{' '}
          <span className="text-muted-foreground text-xs font-normal">(optional)</span>
        </Label>
        <Textarea
          id="inline-references"
          placeholder="Names, companies, or contact details of professional references..."
          value={industryReferences}
          onChange={(e) => setIndustryReferences(e.target.value)}
          rows={3}
        />
      </div>

      {/* Error */}
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
          <>
            Join the Tribe
          </>
        )}
      </Button>
    </form>
  );
}
