import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetProfessionalRegistration } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { AreaOfExpertise, ProfessionalDesignation } from '../backend';
import { timeToDate, formatDate } from '../utils/dateHelpers';

const DEPARTMENT_LABELS: Record<AreaOfExpertise, string> = {
  [AreaOfExpertise.creative]: 'Creative',
  [AreaOfExpertise.production]: 'Production',
  [AreaOfExpertise.accountManagement]: 'Account Management',
  [AreaOfExpertise.strategy]: 'Strategy',
  [AreaOfExpertise.media]: 'Media',
  [AreaOfExpertise.postProduction]: 'Post-Production',
  [AreaOfExpertise.digital]: 'Digital',
  [AreaOfExpertise.pr]: 'PR & Communications',
  [AreaOfExpertise.research]: 'Research & Planning',
  [AreaOfExpertise.other]: 'Other',
};

const DESIGNATION_LABELS: Record<ProfessionalDesignation, string> = {
  [ProfessionalDesignation.director]: 'Director',
  [ProfessionalDesignation.producer]: 'Producer',
  [ProfessionalDesignation.artDirector]: 'Art Director',
  [ProfessionalDesignation.copywriter]: 'Copywriter',
  [ProfessionalDesignation.strategist]: 'Strategist',
  [ProfessionalDesignation.accountExecutive]: 'Account Executive',
  [ProfessionalDesignation.mediaPlanner]: 'Media Planner',
  [ProfessionalDesignation.editor]: 'Editor',
  [ProfessionalDesignation.cinematographer]: 'Cinematographer',
  [ProfessionalDesignation.designer]: 'Designer',
  [ProfessionalDesignation.other]: 'Other',
};

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: registration, isLoading: regLoading } = useGetProfessionalRegistration(
    identity?.getPrincipal() ?? null
  );
  const navigate = useNavigate();

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (profileLoading || regLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-widest text-foreground">MY PROFILE</h1>
        <p className="text-muted-foreground mt-2">Your AD TRIBE professional profile</p>
      </div>

      {/* Basic profile info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="font-medium text-foreground">Name: </span>
            <span className="text-muted-foreground">{userProfile?.name || '—'}</span>
          </p>
        </CardContent>
      </Card>

      {/* Registration details */}
      {registration ? (
        <Card>
          <CardHeader>
            <CardTitle>Professional Registration</CardTitle>
            <CardDescription>Your submitted advertising profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-foreground">Full Name</p>
                <p className="text-muted-foreground">{registration.name}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">City</p>
                <p className="text-muted-foreground">{registration.currentCity}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Department</p>
                <p className="text-muted-foreground">
                  {DEPARTMENT_LABELS[registration.areaOfExpertise] ?? registration.areaOfExpertise}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Designation</p>
                <p className="text-muted-foreground">
                  {DESIGNATION_LABELS[registration.professionalDesignation] ?? registration.professionalDesignation}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Years of Experience</p>
                <p className="text-muted-foreground">{registration.yearsOfExperience.toString()}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Work Reel</p>
                <a
                  href={registration.workReelURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-saffron hover:underline truncate block"
                >
                  {registration.workReelURL}
                </a>
              </div>
            </div>

            {registration.industryReferences && (
              <div className="text-sm">
                <p className="font-medium text-foreground">Industry References</p>
                <p className="text-muted-foreground mt-1">{registration.industryReferences}</p>
              </div>
            )}

            {registration.availability.length > 0 && (
              <div className="text-sm">
                <p className="font-medium text-foreground mb-2">
                  Available Dates ({registration.availability.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {registration.availability.slice(0, 8).map((t, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {formatDate(timeToDate(t))}
                    </Badge>
                  ))}
                  {registration.availability.length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{registration.availability.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Registration Found</CardTitle>
            <CardDescription>
              You haven't submitted your professional registration yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="rounded-full bg-saffron hover:bg-saffron-dark text-forest-deep border-0 shadow-saffron"
              onClick={() => navigate({ to: '/registration' })}
            >
              Complete Registration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
