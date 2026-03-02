import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormErrors {
  productionHouseName?: string;
  address?: string;
  executiveProducers?: string;
  contactNumber?: string;
  workReelUrl?: string;
  industryReferenceEmail?: string;
}

interface ProductionHouseRegistrationFormProps {
  onSuccess: () => void;
}

export default function ProductionHouseRegistrationForm({
  onSuccess,
}: ProductionHouseRegistrationFormProps) {
  const [productionHouseName, setProductionHouseName] = useState('');
  const [address, setAddress] = useState('');
  const [executiveProducers, setExecutiveProducers] = useState<string[]>(['']);
  const [contactNumber, setContactNumber] = useState('');
  const [workReelUrl, setWorkReelUrl] = useState('');
  const [industryReferenceEmail, setIndustryReferenceEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!address.trim()) {
      newErrors.address = 'Address is required.';
    }
    const filledProducers = executiveProducers.filter((p) => p.trim());
    if (filledProducers.length === 0) {
      newErrors.executiveProducers = 'At least one Executive Producer name is required.';
    }
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Official contact number is required.';
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

    setIsSubmitting(true);
    // Simulate brief processing before navigating
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);
    onSuccess();
  };

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

      {/* Address */}
      <div className="space-y-1.5">
        <Label htmlFor="ph-address">
          Address <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="ph-address"
          placeholder="Full office address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          className={errors.address ? 'border-destructive' : ''}
        />
        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
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

      {/* Official Contact Number */}
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
        disabled={isSubmitting}
        className="w-full bg-saffron hover:bg-saffron-dark text-forest-deep border-0 shadow-saffron font-semibold text-base py-3 h-auto"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Submitting…
          </span>
        ) : (
          'Submit Registration'
        )}
      </Button>
    </form>
  );
}
