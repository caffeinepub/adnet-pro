import { useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Users, Calendar, Search, Zap, ArrowRight, X, ChevronUp, Crown, Lock } from 'lucide-react';
import InlineRegistrationForm from '../components/registration/InlineRegistrationForm';
import TribeAvailabilityEnquiryForm from '../components/tribe/TribeAvailabilityEnquiryForm';
import TribeAvailabilityResults from '../components/tribe/TribeAvailabilityResults';
import TribalLeaderRegistrationModal from '../components/TribalLeaderRegistrationModal';
import { useTribalLeaderRole } from '../hooks/useQueries';
import type { TechnicianSearchResult } from '../backend';
import { TribalLeaderRole } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const features = [
  {
    id: 'join',
    icon: Users,
    title: 'Join the Tribe',
    description:
      'Become part of an exclusive community of advertising professionals, vendors, and production houses.',
  },
  {
    id: 'availability',
    icon: Calendar,
    title: 'Tribe Availability',
    description:
      "Sync your calendar with the tribe. Know who's free, when they're free, and book with confidence.",
  },
  {
    id: 'marketplace',
    icon: Search,
    title: 'Tribe Marketplace',
    description:
      'Discover top-tier talent, premium equipment, and stunning shoot locations — all within your tribe.',
  },
  {
    id: 'collaborate',
    icon: Zap,
    title: 'Collaborate as a Tribe',
    description:
      'Send connection requests, build verified partnerships, and create campaigns that move the industry.',
  },
];

const stats = [
  { value: '500+', label: 'Professionals' },
  { value: '200+', label: 'Vendors' },
  { value: '150+', label: 'Locations' },
  { value: '50+', label: 'Production Houses' },
];

export default function LandingPage() {
  const { identity, login } = useInternetIdentity();
  const navigate = useNavigate();
  const formSectionRef = useRef<HTMLDivElement>(null);
  const availabilityFormRef = useRef<HTMLDivElement>(null);

  const [showInlineForm, setShowInlineForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [availabilityResults, setAvailabilityResults] = useState<TechnicianSearchResult | null>(null);
  const [shootCityForResults, setShootCityForResults] = useState('');
  const [isTribalLeaderModalOpen, setIsTribalLeaderModalOpen] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);

  const isAuthenticated = !!identity;

  // Fetch tribal leader role to gate Tribe Availability
  const { data: tribalLeaderRole, isFetched: roleFetched } = useTribalLeaderRole();

  // Only Directors and Production Houses registered via "Start Your Tribe" can access
  const isTribalLeader =
    tribalLeaderRole === TribalLeaderRole.director ||
    tribalLeaderRole === TribalLeaderRole.productionHouse;

  const canAccessAvailabilityForm = isAuthenticated && isTribalLeader;

  // Derive account type for the enquiry form
  const accountType: 'director' | 'productionHouse' =
    tribalLeaderRole === TribalLeaderRole.director ? 'director' : 'productionHouse';

  const handleJoinTribeCard = async () => {
    if (!isAuthenticated) {
      try {
        await login();
      } catch {
        return;
      }
    }
    setShowInlineForm(true);
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleFormSuccess = () => {
    navigate({ to: '/registration/success' });
  };

  const handleAvailabilityAccess = () => {
    if (!canAccessAvailabilityForm) {
      setShowAccessDeniedDialog(true);
      return;
    }
    handleToggleAvailabilityForm();
  };

  const handleToggleAvailabilityForm = () => {
    const willOpen = !showAvailabilityForm;
    setShowAvailabilityForm(willOpen);
    if (!willOpen) {
      setAvailabilityResults(null);
      setShootCityForResults('');
    } else {
      setTimeout(() => {
        availabilityFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  };

  const handleAvailabilityResults = (results: TechnicianSearchResult, city: string) => {
    setAvailabilityResults(results);
    setShootCityForResults(city);
    setTimeout(() => {
      availabilityFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleTribalLeaderContinue = (role: 'director' | 'production_house') => {
    setIsTribalLeaderModalOpen(false);
    navigate({ to: '/registration', search: { role } });
  };

  return (
    <div className="space-y-0 -mt-8">
      {/* ── ACCESS DENIED DIALOG ── */}
      <Dialog open={showAccessDeniedDialog} onOpenChange={setShowAccessDeniedDialog}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader className="items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-saffron/15 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-saffron" />
            </div>
            <DialogTitle className="font-display text-2xl tracking-widest text-foreground">
              ACCESS RESTRICTED
            </DialogTitle>
            <DialogDescription className="text-base text-foreground font-medium">
              Access rights only for Tribal Leaders
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-2 mb-4 leading-relaxed">
            This feature is exclusively available to registered Directors and Production Houses.
            Register as a Tribal Leader via the <strong className="text-saffron">Start Your Tribe</strong> section to unlock access.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              className="w-full bg-saffron hover:bg-saffron-dark text-forest-deep border-0 shadow-saffron font-semibold"
              onClick={() => {
                setShowAccessDeniedDialog(false);
                setIsTribalLeaderModalOpen(true);
              }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Register as Tribal Leader
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden rounded-b-3xl">
        <img
          src="/assets/unnamed.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/80 via-forest-deep/65 to-forest-deep/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_55%,oklch(0.72_0.20_65_/_0.12),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 space-y-8">
          <div className="space-y-6">
            <h1 className="font-display text-[clamp(4rem,14vw,9rem)] leading-none tracking-widest text-white drop-shadow-lg">
              AD TRIBE
            </h1>
            <p className="text-lg md:text-xl font-light text-white/85 max-w-3xl mx-auto leading-relaxed">
              AD Tribe is a smart networking and project coordination app built
              exclusively for advertising professionals. Designed for the
              fast-paced world of advertising, AD Tribe transforms scattered
              coordination into a unified, efficient workflow&mdash;helping
              creative teams move faster, stay aligned, and deliver outstanding
              campaigns.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-primary py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="font-display text-4xl tracking-wider text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-primary-foreground/70 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-display text-5xl tracking-widest text-foreground">
              YOUR TRIBE AWAITS
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to connect, collaborate, and create &mdash; all in
              one place.
            </p>
          </div>

          {/* Features grid with Start Your Tribe prepended */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* ── START YOUR TRIBE card ── */}
            <div
              className="group bg-card border border-saffron/40 rounded-2xl p-6 space-y-4 transition-all duration-300 hover:border-saffron/70 hover:shadow-saffron cursor-pointer"
              onClick={() => setIsTribalLeaderModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsTribalLeaderModalOpen(true);
                }
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-saffron/15 group-hover:bg-saffron/25 flex items-center justify-center transition-colors">
                <Crown className="w-6 h-6 text-saffron" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Start Your Tribe
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Register as a tribal leader and shape the advertising community as a Director or Production House.
                </p>
              </div>

              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron/70 group-hover:text-saffron transition-colors">
                  Register as Tribal Leader
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* ── EXISTING FEATURE CARDS ── */}
            {features.map((feature) => {
              const Icon = feature.icon;
              const isJoinCard = feature.id === 'join';
              const isAvailabilityCard = feature.id === 'availability';
              const isJoinActive = isJoinCard && showInlineForm;
              const isAvailabilityActive = isAvailabilityCard && showAvailabilityForm;
              const isAvailabilityLocked = isAvailabilityCard && !canAccessAvailabilityForm;

              return (
                <div
                  key={feature.id}
                  className={`group bg-card border rounded-2xl p-6 space-y-4 transition-all duration-300
                    ${isJoinCard
                      ? 'cursor-pointer hover:border-primary/70 hover:shadow-forest border-primary/30'
                      : isAvailabilityCard
                        ? 'border-border hover:border-saffron/50 hover:shadow-saffron'
                        : 'border-border hover:border-primary/50 hover:shadow-forest'
                    }
                    ${isJoinActive ? 'border-primary shadow-forest ring-1 ring-primary/30' : ''}
                    ${isAvailabilityActive ? 'border-saffron/50 shadow-saffron ring-1 ring-saffron/20' : ''}
                  `}
                  onClick={isJoinCard ? handleJoinTribeCard : undefined}
                  role={isJoinCard ? 'button' : undefined}
                  tabIndex={isJoinCard ? 0 : undefined}
                  onKeyDown={
                    isJoinCard
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleJoinTribeCard();
                          }
                        }
                      : undefined
                  }
                  aria-expanded={isJoinCard ? showInlineForm : undefined}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                      ${isJoinCard
                        ? 'bg-saffron/15 group-hover:bg-saffron/25'
                        : isAvailabilityCard
                          ? 'bg-primary/10 group-hover:bg-primary/20'
                          : 'bg-primary/10 group-hover:bg-primary/20'
                      }
                    `}
                  >
                    <Icon className={`w-6 h-6 ${isJoinCard ? 'text-saffron' : 'text-primary'}`} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      {feature.title}
                      {isAvailabilityLocked && roleFetched && (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Join card CTA link */}
                  {isJoinCard && (
                    <div className="pt-1">
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors
                          ${isJoinActive ? 'text-saffron' : 'text-saffron/70 group-hover:text-saffron'}
                        `}
                      >
                        {isJoinActive ? (
                          <>
                            <X className="w-3.5 h-3.5" />
                            Close form
                          </>
                        ) : (
                          <>
                            Register now
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Availability card CTA link */}
                  {isAvailabilityCard && (
                    <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={handleAvailabilityAccess}
                        className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors
                          ${isAvailabilityActive
                            ? 'text-saffron'
                            : isAvailabilityLocked
                              ? 'text-muted-foreground/60 hover:text-saffron/80'
                              : 'text-saffron/70 hover:text-saffron'
                          }
                        `}
                      >
                        {isAvailabilityActive ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            Close search
                          </>
                        ) : (
                          <>
                            Find Available Crew
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── INLINE REGISTRATION FORM ── */}
          {showInlineForm && (
            <div ref={formSectionRef} className="mt-10 max-w-2xl mx-auto">
              <div className="bg-card border border-primary/30 rounded-2xl p-8 shadow-forest space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-display text-3xl tracking-widest text-foreground">
                      JOIN THE TRIBE
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Tell us about yourself and become part of the AD TRIBE community.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInlineForm(false)}
                    className="mt-1 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                    aria-label="Close registration form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="border-t border-border" />
                <InlineRegistrationForm onSuccess={handleFormSuccess} />
              </div>
            </div>
          )}

          {/* ── TRIBE AVAILABILITY ENQUIRY FORM + RESULTS ── */}
          {showAvailabilityForm && canAccessAvailabilityForm && (
            <div ref={availabilityFormRef} className="mt-10 max-w-3xl mx-auto">
              <div className="bg-card border border-saffron/30 rounded-2xl p-8 shadow-saffron space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-saffron" />
                      <h3 className="font-display text-3xl tracking-widest text-foreground">
                        FIND AVAILABLE CREW
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Search for available technicians from the AD TRIBE database for your project.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAvailabilityForm(false);
                      setAvailabilityResults(null);
                      setShootCityForResults('');
                    }}
                    className="mt-1 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                    aria-label="Close availability form"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="border-t border-border" />
                <TribeAvailabilityEnquiryForm
                  accountType={accountType}
                  onResults={handleAvailabilityResults}
                />
                {availabilityResults && (
                  <>
                    <div className="border-t border-border" />
                    <TribeAvailabilityResults
                      results={availabilityResults}
                      shootCity={shootCityForResults}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── TRIBAL LEADER REGISTRATION MODAL ── */}
      <TribalLeaderRegistrationModal
        isOpen={isTribalLeaderModalOpen}
        onClose={() => setIsTribalLeaderModalOpen(false)}
        onContinue={handleTribalLeaderContinue}
      />
    </div>
  );
}
