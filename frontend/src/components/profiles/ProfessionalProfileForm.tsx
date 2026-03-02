import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  useGetProfessionalRegistration,
  AreaOfExpertise,
  ProfessionalDesignation,
} from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { formatDate, timeToDate } from '../../utils/dateHelpers';

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

export default function ProfessionalProfileForm() {
  const { identity } = useInternetIdentity();
  const { data: registration, isLoading } = useGetProfessionalRegistration(
    identity?.getPrincipal() ?? null
  );
  const navigate = useNavigate();

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading registration...</p>;
  }

  if (!registration) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Registration Found</CardTitle>
          <CardDescription>Complete your professional registration to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="shadow-amber rounded-full" onClick={() => navigate({ to: '/registration' })}>
            Register Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
          <CardDescription>Your submitted advertising registration</CardDescription>
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
                className="text-primary hover:underline truncate block"
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
    </div>
  );
}
