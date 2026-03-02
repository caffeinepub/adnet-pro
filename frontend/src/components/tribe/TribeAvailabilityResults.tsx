import { Phone, MapPin, Briefcase, User, Users, Globe } from 'lucide-react';
import type { TechnicianSearchResult, TechnicianResult } from '../../backend';

interface Props {
  results: TechnicianSearchResult;
  shootCity: string;
}

function TechnicianCard({ tech }: { tech: TechnicianResult }) {
  return (
    <div className="bg-background border border-border rounded-xl p-4 space-y-3 hover:border-primary/40 hover:shadow-forest transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground text-sm leading-tight">{tech.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Briefcase className="w-3 h-3 text-saffron flex-shrink-0" />
            <p className="text-xs text-saffron font-medium truncate">{tech.role}</p>
          </div>
        </div>
      </div>
      <div className="space-y-1.5 pt-1 border-t border-border/60">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
          <span>{tech.city}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground">
          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
          <a
            href={`tel:${tech.contactNumber}`}
            className="hover:text-saffron transition-colors font-medium"
          >
            {tech.contactNumber}
          </a>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
        <Users className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export default function TribeAvailabilityResults({ results, shootCity }: Props) {
  const totalCount = results.sameCityMatches.length + results.otherCityMatches.length;

  return (
    <div className="space-y-8 pt-2">
      {/* Summary banner */}
      <div className="flex items-center gap-3 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {totalCount === 0
              ? 'No technicians found for your criteria'
              : `${totalCount} technician${totalCount !== 1 ? 's' : ''} found`}
          </p>
          <p className="text-xs text-muted-foreground">
            {results.sameCityMatches.length} in {shootCity} &middot;{' '}
            {results.otherCityMatches.length} in other cities
          </p>
        </div>
      </div>

      {/* Same City Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-saffron" />
          <h4 className="font-semibold text-foreground text-base">
            Available in {shootCity}
          </h4>
          <span className="ml-auto text-xs font-medium bg-saffron/15 text-saffron-dark border border-saffron/30 rounded-full px-2 py-0.5">
            {results.sameCityMatches.length} found
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.sameCityMatches.length > 0 ? (
            results.sameCityMatches.map((tech, idx) => (
              <TechnicianCard key={`same-${idx}`} tech={tech} />
            ))
          ) : (
            <EmptyState message={`No technicians available in ${shootCity} for these dates`} />
          )}
        </div>
      </div>

      {/* Other Cities Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-foreground text-base">
            Available in Other Cities
          </h4>
          <span className="ml-auto text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">
            {results.otherCityMatches.length} found
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.otherCityMatches.length > 0 ? (
            results.otherCityMatches.map((tech, idx) => (
              <TechnicianCard key={`other-${idx}`} tech={tech} />
            ))
          ) : (
            <EmptyState message="No technicians available in other cities for these dates" />
          )}
        </div>
      </div>
    </div>
  );
}
