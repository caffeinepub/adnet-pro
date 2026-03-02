import { useState, useEffect } from 'react';
import { X, Edit2, Save, CheckCircle, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import AvailabilityCalendar from '../calendar/AvailabilityCalendar';
import { useCreateOrUpdateProfile, useUpdateAvailability } from '../../hooks/useQueries';
import type { UserProfile } from '../../backend';

interface UserProfilePanelProps {
  profile: UserProfile;
  onClose: () => void;
}

// Parse ISO date strings back to Date objects
function parseDates(dateStrings: string[]): Date[] {
  return dateStrings
    .map((s) => {
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    })
    .filter((d): d is Date => d !== null);
}

// Convert Date objects to ISO date strings
function formatDates(dates: Date[]): string[] {
  return dates.map((d) => d.toISOString().split('T')[0]);
}

interface FieldRowProps {
  label: string;
  value: string | number | bigint;
}

function FieldRow({ label, value }: FieldRowProps) {
  const display = value === '' || value === undefined ? '—' : String(value);
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-foreground font-medium">{display}</span>
    </div>
  );
}

interface EditFormErrors {
  fullName?: string;
  email?: string;
  contactNumber?: string;
  city?: string;
  department?: string;
  designation?: string;
  yearsOfExperience?: string;
  workReelUrl?: string;
  industryReferenceEmail?: string;
}

export default function UserProfilePanel({ profile, onClose }: UserProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [availSaveSuccess, setAvailSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<EditFormErrors>({});

  // Edit form state
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [contactNumber, setContactNumber] = useState(profile.contactNumber);
  const [city, setCity] = useState(profile.city);
  const [department, setDepartment] = useState(profile.department);
  const [designation, setDesignation] = useState(profile.designation);
  const [yearsOfExperience, setYearsOfExperience] = useState(
    String(profile.yearsOfExperience)
  );
  const [tribeCompanyName, setTribeCompanyName] = useState(profile.tribeCompanyName);
  const [workReelUrl, setWorkReelUrl] = useState(profile.workReelUrl);
  const [industryReferenceEmail, setIndustryReferenceEmail] = useState(
    profile.industryReferenceEmail
  );
  const [executiveProducers, setExecutiveProducers] = useState<string[]>(
    profile.executiveProducers.length > 0 ? profile.executiveProducers : ['']
  );

  // Availability state
  const [availabilityDates, setAvailabilityDates] = useState<Date[]>(
    parseDates(profile.availability)
  );

  const updateProfileMutation = useCreateOrUpdateProfile();
  const updateAvailabilityMutation = useUpdateAvailability();

  // Sync state when profile prop changes
  useEffect(() => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setContactNumber(profile.contactNumber);
    setCity(profile.city);
    setDepartment(profile.department);
    setDesignation(profile.designation);
    setYearsOfExperience(String(profile.yearsOfExperience));
    setTribeCompanyName(profile.tribeCompanyName);
    setWorkReelUrl(profile.workReelUrl);
    setIndustryReferenceEmail(profile.industryReferenceEmail);
    setExecutiveProducers(
      profile.executiveProducers.length > 0 ? profile.executiveProducers : ['']
    );
    setAvailabilityDates(parseDates(profile.availability));
  }, [profile]);

  const validate = (): boolean => {
    const newErrors: EditFormErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email.';
    }
    if (!contactNumber.trim()) newErrors.contactNumber = 'Contact number is required.';
    if (!city.trim()) newErrors.city = 'City is required.';
    if (!department.trim()) newErrors.department = 'Department is required.';
    if (!designation.trim()) newErrors.designation = 'Designation is required.';
    const years = parseInt(yearsOfExperience, 10);
    if (!yearsOfExperience || isNaN(years) || years < 0) {
      newErrors.yearsOfExperience = 'Please enter a valid number of years.';
    }
    if (workReelUrl.trim()) {
      try {
        new URL(workReelUrl);
      } catch {
        newErrors.workReelUrl = 'Please enter a valid URL.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validate()) return;

    const updatedProfile: UserProfile = {
      fullName: fullName.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      city: city.trim(),
      department: department.trim(),
      designation: designation.trim(),
      yearsOfExperience: BigInt(parseInt(yearsOfExperience, 10)),
      tribeCompanyName: tribeCompanyName.trim(),
      role: profile.role,
      executiveProducers: executiveProducers.filter((p) => p.trim()),
      workReelUrl: workReelUrl.trim(),
      industryReferenceEmail: industryReferenceEmail.trim(),
      availability: formatDates(availabilityDates),
    };

    await updateProfileMutation.mutateAsync(updatedProfile);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveAvailability = async () => {
    await updateAvailabilityMutation.mutateAsync(formatDates(availabilityDates));
    setAvailSaveSuccess(true);
    setTimeout(() => setAvailSaveSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    // Reset to current profile values
    setFullName(profile.fullName);
    setEmail(profile.email);
    setContactNumber(profile.contactNumber);
    setCity(profile.city);
    setDepartment(profile.department);
    setDesignation(profile.designation);
    setYearsOfExperience(String(profile.yearsOfExperience));
    setTribeCompanyName(profile.tribeCompanyName);
    setWorkReelUrl(profile.workReelUrl);
    setIndustryReferenceEmail(profile.industryReferenceEmail);
    setExecutiveProducers(
      profile.executiveProducers.length > 0 ? profile.executiveProducers : ['']
    );
    setErrors({});
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isProductionHouse = profile.role === 'Production House';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-card border-l border-border shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/95 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center flex-shrink-0">
              <span className="text-forest-deep font-bold text-sm">
                {getInitials(profile.fullName || 'U')}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-base leading-tight">
                {profile.fullName || 'My Profile'}
              </h2>
              <Badge variant="outline" className="text-xs mt-0.5 border-saffron/50 text-saffron">
                {profile.role || 'Member'}
              </Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Close profile panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-5 space-y-6">
            {/* Success Banner */}
            {saveSuccess && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2.5 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Profile updated successfully!
              </div>
            )}

            {/* Edit / View Toggle */}
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg tracking-wider text-foreground">
                PROFILE DETAILS
              </h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-1.5 border-saffron/50 text-saffron hover:bg-saffron/10"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="text-muted-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                    className="bg-saffron hover:bg-saffron-dark text-forest-deep border-0 gap-1.5"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>

            {/* Profile Fields */}
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FieldRow label="Full Name" value={profile.fullName} />
                  <FieldRow label="Role" value={profile.role} />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <FieldRow label="Email" value={profile.email} />
                  <FieldRow label="Contact Number" value={profile.contactNumber} />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <FieldRow label="City" value={profile.city} />
                  <FieldRow label="Tribe / Company" value={profile.tribeCompanyName} />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <FieldRow label="Department" value={profile.department} />
                  <FieldRow label="Designation" value={profile.designation} />
                </div>
                <Separator />
                <FieldRow
                  label="Years of Experience"
                  value={`${profile.yearsOfExperience} year${Number(profile.yearsOfExperience) !== 1 ? 's' : ''}`}
                />
                {isProductionHouse && profile.executiveProducers.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-1.5">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Executive Producers
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profile.executiveProducers.map((ep, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {ep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <Separator />
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Work Reel URL
                  </span>
                  {profile.workReelUrl ? (
                    <a
                      href={profile.workReelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-saffron hover:underline break-all"
                    >
                      {profile.workReelUrl}
                    </a>
                  ) : (
                    <span className="text-sm text-foreground">—</span>
                  )}
                </div>
                <Separator />
                <FieldRow
                  label="Industry Reference Email"
                  value={profile.industryReferenceEmail}
                />
              </div>
            ) : (
              /* Edit Form */
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-fullname">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={errors.fullName ? 'border-destructive' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Contact Number */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-contact">
                    Contact Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-contact"
                    type="tel"
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
                  <Label htmlFor="edit-city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive">{errors.city}</p>
                  )}
                </div>

                {/* Tribe / Company Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-tribe">Tribe / Company Name</Label>
                  <Input
                    id="edit-tribe"
                    value={tribeCompanyName}
                    onChange={(e) => setTribeCompanyName(e.target.value)}
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-dept">
                    Department <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={errors.department ? 'border-destructive' : ''}
                  />
                  {errors.department && (
                    <p className="text-xs text-destructive">{errors.department}</p>
                  )}
                </div>

                {/* Designation */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-desig">
                    Designation <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-desig"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className={errors.designation ? 'border-destructive' : ''}
                  />
                  {errors.designation && (
                    <p className="text-xs text-destructive">{errors.designation}</p>
                  )}
                </div>

                {/* Years of Experience */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-years">
                    Years of Experience <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-years"
                    type="number"
                    min="0"
                    max="60"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className={errors.yearsOfExperience ? 'border-destructive' : ''}
                  />
                  {errors.yearsOfExperience && (
                    <p className="text-xs text-destructive">{errors.yearsOfExperience}</p>
                  )}
                </div>

                {/* Executive Producers (Production House only) */}
                {isProductionHouse && (
                  <div className="space-y-2">
                    <Label>Executive Producers</Label>
                    <div className="space-y-2">
                      {executiveProducers.map((ep, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input
                            value={ep}
                            onChange={(e) => {
                              const updated = [...executiveProducers];
                              updated[i] = e.target.value;
                              setExecutiveProducers(updated);
                            }}
                            placeholder={`Executive Producer ${i + 1}`}
                            className="flex-1"
                          />
                          {executiveProducers.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExecutiveProducers(executiveProducers.filter((_, idx) => idx !== i))
                              }
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {executiveProducers.length < 3 && (
                        <button
                          type="button"
                          onClick={() => setExecutiveProducers([...executiveProducers, ''])}
                          className="text-xs text-saffron hover:text-saffron-dark font-medium flex items-center gap-1"
                        >
                          + Add Producer
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Work Reel URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-reel">Work Reel URL</Label>
                  <Input
                    id="edit-reel"
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

                {/* Industry Reference Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-ref">Industry Reference Email</Label>
                  <Input
                    id="edit-ref"
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

                {updateProfileMutation.isError && (
                  <p className="text-xs text-destructive">
                    {updateProfileMutation.error?.message ?? 'Failed to save. Please try again.'}
                  </p>
                )}
              </div>
            )}

            {/* Availability Calendar Section */}
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-saffron" />
                <h3 className="font-display text-lg tracking-wider text-foreground">
                  MY AVAILABILITY
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Toggle dates to mark when you are available for shoots. This is used by the Tribe Availability search.
              </p>

              <AvailabilityCalendar
                selectedDates={availabilityDates}
                onDatesChange={setAvailabilityDates}
                readOnly={false}
              />

              {availSaveSuccess && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2.5 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Availability saved successfully!
                </div>
              )}

              <Button
                onClick={handleSaveAvailability}
                disabled={updateAvailabilityMutation.isPending}
                className="w-full bg-saffron hover:bg-saffron-dark text-forest-deep border-0 shadow-saffron font-semibold"
              >
                {updateAvailabilityMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </span>
                ) : (
                  'Save Availability'
                )}
              </Button>

              {updateAvailabilityMutation.isError && (
                <p className="text-xs text-destructive text-center">
                  {updateAvailabilityMutation.error?.message ?? 'Failed to save availability.'}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
