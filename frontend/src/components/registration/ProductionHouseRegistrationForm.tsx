import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitProductionHouseRegistration } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

interface FormErrors {
  productionHouseName?: string;
  fullName?: string;
  email?: string;
  contactNumber?: string;
  city?: string;
  department?: string;
  designation?: string;
  yearsOfExperience?: string;
  executiveProducers?: string;
  workReelUrl?: string;
  industryReferenceEmail?: string;
}

interface ProductionHouseRegistrationFormProps {
  onSuccess: () => void;
}

export default function ProductionHouseRegistrationForm({
  onSuccess,
}: ProductionHouseRegistrationFormProps) {
  const { identity } = useInternetIdentity();
  const submitMutation = useSubmitProductionHouseRegistration();

  const [productionHouseName, setProductionHouseName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [executiveProducers, setExecutiveProducers] = useState<string[]>(['']);
  const [workReelUrl, setWorkReelUrl] = useState('');
  const [industryReferenceEmail, setIndustryReferenceEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const MAX_PRODUCERS = 3;

  const addProducer = () => {
    if (executiveProducers.length < MAX_PRODUCERS) {
      setExecutiveProducers([...executiveProducers, '']);
    }
  };

  const removeProducer = (index: number) => {
    if (executiveProducers.length === 1) return;
    setExecutiveProducers(executiveProducers.filter((_, i) => i !== index));
  };

  const updateProducer = (index: number, value: string) => {
    const updated = [...executiveProducers];
    updated[index] = value;
    setExecutiveProducers(updated);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!productionHouseName.trim()) {
      newErrors.productionHouseName = 'Production House name is required.';
    }
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Official contact number is required.';
    }
    if (!city.trim()) {
      newErrors.city = 'City is required.';
    }
    if (!department.trim()) {
      newErrors.department = 'Department is required.';
    }
    if (!designation.trim()) {
      newErrors.designation = 'Designation is required.';
    }
    const years = parseInt(yearsOfExperience, 10);
    if (!yearsOfExperience || isNaN(years) || years < 0) {
      newErrors.yearsOfExperience = 'Please enter a valid number of years.';
    }
    const filledProducers = executiveProducers.filter((p) => p.trim());
    if (filledProducers.length === 0) {
      newErrors.executiveProducers = 'At least one Executive Producer name is required.';
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
    if (!industryReferenceEmail.trim()) {
      newErrors.industryReferenceEmail = 'Industry reference email is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const filledProducers = executiveProducers.filter((p) => p.trim());

    await submitMutation.mutateAsync({
      fullName: fullName.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      city: city.trim(),
      department: department.trim(),
      designation: designation.trim(),
      yearsOfExperience: BigInt(parseInt(yearsOfExperience, 10)),
      tribeCompanyName: productionHouseName.trim(),
      role: 'Production House',
      executiveProducers: filledProducers,
      workReelUrl: workReelUrl.trim(),
      industryReferenceEmail: industryReferenceEmail.trim(),
      availability: [],
    });

    onSuccess();
  };

  const isAuthenticated = !!identity;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Production House Name */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-name">
          Production House Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ph-name"
          type="text"
          placeholder="e.g. Tribal Films Pvt. Ltd."
          value={productionHouseName}
          onChange={(e) => setProductionHouseName(e.target.value)}
          className={errors.productionHouseName ? 'border-destructive' : ''}
        />
        {errors.productionHouseName && (
          <p className="text-xs text-destructive">{errors.productionHouseName}</p>
        )}
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-fullname">
          Your Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ph-fullname"
          type="text"
          placeholder="e.g. Priya Sharma"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={errors.fullName ? 'border-destructive' : ''}
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-email-addr">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ph-email-addr"
          type="email"
          placeholder="e.g. priya@tribalfilms.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      {/* Contact Number */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-contact">
          Official Contact Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ph-contact"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className={errors.contactNumber ? 'border-destructive' : ''}
        />
        {errors.contactNumber && (
          <p className="text-xs text-destructive">{errors.contactNumber}</p>
        )}
      </div>

      {/* City */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-city">
          City <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ph-city"
          type="text"
          placeholder="e.g. Mumbai"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={errors.city ? 'border-destructive' : ''}
        />
        {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
      </div>

      {/* Department */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-department">
          Department <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ph-department"
          type="text"
          placeholder="e.g. Production, Creative"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={errors.department ? 'border-destructive' : ''}
        />
        {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
      </div>

      {/* Designation */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-designation">
          Designation <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ph-designation"
          type="text"
          placeholder="e.g. Producer, Executive Producer"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className={errors.designation ? 'border-destructive' : ''}
        />
        {errors.designation && <p className="text-xs text-destructive">{errors.designation}</p>}
      </div>

      {/* Years of Experience */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-years">
          Years of Experience <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ph-years"
          type="number"
          min="0"
          max="60"
          placeholder="e.g. 10"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          className={errors.yearsOfExperience ? 'border-destructive' : ''}
        />
        {errors.yearsOfExperience && (
          <p className="text-xs text-destructive">{errors.yearsOfExperience}</p>
        )}
      </div>

      {/* Executive Producers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>
            Executive Producer <span className="text-destructive">*</span>
            <span className="ml-1.5 text-xs text-muted-foreground font-normal">
              (up to {MAX_PRODUCERS})
            </span>
          </Label>
          {executiveProducers.length < MAX_PRODUCERS && (
            <button
              type="button"
              onClick={addProducer}
              className="flex items-center gap-1 text-xs font-medium text-saffron hover:text-saffron-dark transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          )}
        </div>

        <div className="space-y-2">
          {executiveProducers.map((producer, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={`Executive Producer ${index + 1} name`}
                value={producer}
                onChange={(e) => updateProducer(index, e.target.value)}
                className={`flex-1 ${errors.executiveProducers ? 'border-destructive' : ''}`}
              />
              {executiveProducers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProducer(index)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                  aria-label={`Remove producer ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.executiveProducers && (
          <p className="text-xs text-destructive">{errors.executiveProducers}</p>
        )}
      </div>

      {/* Work Reel URL */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-reel">
          Work Reel URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ph-reel"
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

      {/* Industry Reference Official Email ID */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-email">
          Industry Reference Official Email ID <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ph-email"
          type="email"
          placeholder="reference@agency.com"
          value={industryReferenceEmail}
          onChange={(e) => setIndustryReferenceEmail(e.target.value)}
          className={errors.industryReferenceEmail ? 'border-destructive' : ''}
        />
        {errors.industryReferenceEmail && (
          <p className="text-xs text-destructive">{errors.industryReferenceEmail}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={submitMutation.isPending || !isAuthenticated}
        className="w-full bg-saffron hover:bg-saffron-dark text-forest-deep border-0 shadow-saffron font-semibold text-base py-3 h-auto"
      >
        {submitMutation.isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4" />
            Submitting…
          </span>
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
