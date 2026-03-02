import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown, Search, Loader2 } from 'lucide-react';
import { useSearchTechnicians } from '../../hooks/useQueries';
import { dateToTime } from '../../utils/dateHelpers';
import type { TechnicianSearchResult } from '../../backend';

const PREDEFINED_ROLES = [
  'Cinematographer',
  'Editor',
  'Gaffer',
  'Sound Recordist',
  'Art Director',
  'Colourist',
  'Production Designer',
  'Costume Designer',
  'Makeup Artist',
  'Stunt Coordinator',
  'VFX Supervisor',
  'Drone Operator',
  'Focus Puller',
  'Clapper Loader',
  'Script Supervisor',
  'Director',
  'Producer',
  'Assistant Director',
  'Camera Operator',
  'Lighting Technician',
];

interface FormData {
  projectName: string;
  directorName: string;
  productionHouseName: string;
  shootCity: string;
  shootStartDate: string;
  shootEndDate: string;
  availableFrom: string;
  selectedRoles: string[];
  specialRequirements: string;
}

interface Props {
  accountType: 'director' | 'productionHouse';
  onResults: (results: TechnicianSearchResult, city: string) => void;
}

export default function TribeAvailabilityEnquiryForm({ accountType, onResults }: Props) {
  const searchTechnicians = useSearchTechnicians();

  const [form, setForm] = useState<FormData>({
    projectName: '',
    directorName: '',
    productionHouseName: '',
    shootCity: '',
    shootStartDate: '',
    shootEndDate: '',
    availableFrom: '',
    selectedRoles: [],
    specialRequirements: '',
  });

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const availableRoles = PREDEFINED_ROLES.filter(
    (role) => !form.selectedRoles.includes(role)
  );

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const addRole = (role: string) => {
    setForm((prev) => ({ ...prev, selectedRoles: [...prev.selectedRoles, role] }));
    setRoleDropdownOpen(false);
    if (errors.selectedRoles) {
      setErrors((prev) => ({ ...prev, selectedRoles: undefined }));
    }
  };

  const removeRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      selectedRoles: prev.selectedRoles.filter((r) => r !== role),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (accountType === 'director' && !form.directorName.trim())
      newErrors.directorName = 'Director name is required';
    if (accountType === 'productionHouse' && !form.productionHouseName.trim())
      newErrors.productionHouseName = 'Production house name is required';
    if (!form.shootCity.trim()) newErrors.shootCity = 'Shoot city is required';
    if (!form.shootStartDate) newErrors.shootStartDate = 'Shoot start date is required';
    if (!form.shootEndDate) newErrors.shootEndDate = 'Shoot end date is required';
    if (form.shootStartDate && form.shootEndDate && form.shootStartDate > form.shootEndDate)
      newErrors.shootEndDate = 'End date must be after start date';
    if (!form.availableFrom) newErrors.availableFrom = 'Available from date is required';
    if (form.selectedRoles.length === 0)
      newErrors.selectedRoles = 'Please select at least one technician role';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const shootEnd = new Date(form.shootEndDate);
    const availFrom = new Date(form.availableFrom);

    try {
      const result = await searchTechnicians.mutateAsync({
        city: form.shootCity.trim(),
        availableFrom: dateToTime(availFrom),
        availableTo: dateToTime(shootEnd),
        requiredRoles: form.selectedRoles,
      });
      onResults(result, form.shootCity.trim());
    } catch {
      // error handled by mutation state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Project Name */}
      <div className="space-y-1.5">
        <Label htmlFor="projectName" className="text-sm font-medium text-foreground">
          Project Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="projectName"
          value={form.projectName}
          onChange={(e) => handleChange('projectName', e.target.value)}
          placeholder="e.g. Summer Campaign 2026"
          className={errors.projectName ? 'border-destructive' : ''}
        />
        {errors.projectName && (
          <p className="text-xs text-destructive">{errors.projectName}</p>
        )}
      </div>

      {/* Conditional: Director Name or Production House Name */}
      {accountType === 'director' ? (
        <div className="space-y-1.5">
          <Label htmlFor="directorName" className="text-sm font-medium text-foreground">
            Director Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="directorName"
            value={form.directorName}
            onChange={(e) => handleChange('directorName', e.target.value)}
            placeholder="Your name as director"
            className={errors.directorName ? 'border-destructive' : ''}
          />
          {errors.directorName && (
            <p className="text-xs text-destructive">{errors.directorName}</p>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="productionHouseName" className="text-sm font-medium text-foreground">
            Production House Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="productionHouseName"
            value={form.productionHouseName}
            onChange={(e) => handleChange('productionHouseName', e.target.value)}
            placeholder="Your production house name"
            className={errors.productionHouseName ? 'border-destructive' : ''}
          />
          {errors.productionHouseName && (
            <p className="text-xs text-destructive">{errors.productionHouseName}</p>
          )}
        </div>
      )}

      {/* Shoot City */}
      <div className="space-y-1.5">
        <Label htmlFor="shootCity" className="text-sm font-medium text-foreground">
          City of Shoot <span className="text-destructive">*</span>
        </Label>
        <Input
          id="shootCity"
          value={form.shootCity}
          onChange={(e) => handleChange('shootCity', e.target.value)}
          placeholder="e.g. Mumbai, Delhi, Bangalore"
          className={errors.shootCity ? 'border-destructive' : ''}
        />
        {errors.shootCity && (
          <p className="text-xs text-destructive">{errors.shootCity}</p>
        )}
      </div>

      {/* Shoot Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="shootStartDate" className="text-sm font-medium text-foreground">
            Shoot Start Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="shootStartDate"
            type="date"
            value={form.shootStartDate}
            onChange={(e) => handleChange('shootStartDate', e.target.value)}
            className={errors.shootStartDate ? 'border-destructive' : ''}
          />
          {errors.shootStartDate && (
            <p className="text-xs text-destructive">{errors.shootStartDate}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="shootEndDate" className="text-sm font-medium text-foreground">
            Shoot End Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="shootEndDate"
            type="date"
            value={form.shootEndDate}
            onChange={(e) => handleChange('shootEndDate', e.target.value)}
            min={form.shootStartDate}
            className={errors.shootEndDate ? 'border-destructive' : ''}
          />
          {errors.shootEndDate && (
            <p className="text-xs text-destructive">{errors.shootEndDate}</p>
          )}
        </div>
      </div>

      {/* Available From */}
      <div className="space-y-1.5">
        <Label htmlFor="availableFrom" className="text-sm font-medium text-foreground">
          Technicians Available From <span className="text-destructive">*</span>
        </Label>
        <Input
          id="availableFrom"
          type="date"
          value={form.availableFrom}
          onChange={(e) => handleChange('availableFrom', e.target.value)}
          className={errors.availableFrom ? 'border-destructive' : ''}
        />
        {errors.availableFrom && (
          <p className="text-xs text-destructive">{errors.availableFrom}</p>
        )}
      </div>

      {/* Technicians Needed — multi-select dropdown */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-foreground">
          Technicians Needed <span className="text-destructive">*</span>
        </Label>

        {/* Selected roles as chips */}
        {form.selectedRoles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {form.selectedRoles.map((role) => (
              <Badge
                key={role}
                variant="secondary"
                className="flex items-center gap-1 bg-saffron/15 text-saffron-dark border border-saffron/30 hover:bg-saffron/25 pr-1"
              >
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(role)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-saffron/30 transition-colors"
                  aria-label={`Remove ${role}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Dropdown trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleDropdownOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md border bg-background transition-colors
              ${errors.selectedRoles ? 'border-destructive' : 'border-input hover:border-primary/60'}
              ${roleDropdownOpen ? 'border-primary ring-1 ring-primary/30' : ''}
            `}
          >
            <span className={form.selectedRoles.length === 0 ? 'text-muted-foreground' : 'text-foreground'}>
              {form.selectedRoles.length === 0
                ? 'Select technician roles...'
                : `${form.selectedRoles.length} role${form.selectedRoles.length > 1 ? 's' : ''} selected — click to add more`}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {roleDropdownOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-52 overflow-y-auto">
              {availableRoles.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">All roles selected</p>
              ) : (
                availableRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => addRole(role)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-saffron/10 hover:text-saffron-dark transition-colors"
                  >
                    {role}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {errors.selectedRoles && (
          <p className="text-xs text-destructive">{errors.selectedRoles}</p>
        )}
      </div>

      {/* Special Requirements */}
      <div className="space-y-1.5">
        <Label htmlFor="specialRequirements" className="text-sm font-medium text-foreground">
          Special Requirements{' '}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="specialRequirements"
          value={form.specialRequirements}
          onChange={(e) => handleChange('specialRequirements', e.target.value)}
          placeholder="Any specific skills, equipment, or experience required..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Error state */}
      {searchTechnicians.isError && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          Something went wrong. Please try again.
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={searchTechnicians.isPending}
        className="w-full rounded-full bg-saffron hover:bg-saffron-dark text-forest-deep border-0 shadow-saffron font-semibold tracking-wide"
      >
        {searchTechnicians.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Find Available Crew
          </>
        )}
      </Button>
    </form>
  );
}
