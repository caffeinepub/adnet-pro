import { useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, Calendar, Search, Zap, ArrowRight, X, ChevronUp, Crown } from 'lucide-react';
import InlineRegistrationForm from '../components/registration/InlineRegistrationForm';
import TribeAvailabilityEnquiryForm from '../components/tribe/TribeAvailabilityEnquiryForm';
import TribeAvailabilityResults from '../components/tribe/TribeAvailabilityResults';
import TribalLeaderRegistrationModal from '../components/TribalLeaderRegistrationModal';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import type { TechnicianSearchResult } from '../backend';
import { ProfessionalDesignation } from '../backend';

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

  const isAuthenticated = !!identity;

  // Fetch user profile to determine account type
  const { data: userProfile } = useGetCallerUserProfile();

  // Directors and Producers (production house) can access the crew search
  const isDirector = userProfile?.professionalDesignation === ProfessionalDesignation.director;
  const isProducer = userProfile?.professionalDesignation === ProfessionalDesignation.producer;
  const canAccessAvailabilityForm = isAuthenticated && (isDirector || isProducer);

  // Derive account type for the form
  const accountType: 'director' | 'productionHouse' = isDirector ? 'director' : 'productionHouse';

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
    <TooltipProvider>
      <div className="space-y-0 -mt-8">
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

            {/* ── START YOUR TRIBE card + JOIN THE TRIBE card side by side (or stacked on mobile) ── */}
            <div className="grid md:grid-cols-2 gap-6 mb-6 max-w-2xl mx-auto lg:max-w-none lg:grid-cols-4 lg:mb-0">
              {/* START YOUR TRIBE card — spans 2 cols on lg, sits before the features grid */}
              <div className="lg:col-span-2 lg:hidden" />
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

                return (
                  <div
                    key={feature.id}
                    className={`group bg-card border rounded-2xl p-6 space-y-4 transition-all duration-300
                      ${isJoinCard
                        ? 'cursor-pointer hover:border-primary/70 hover:shadow-forest border-primary/30'
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
                          : 'bg-primary/10 group-hover:bg-primary/20'
                        }
                      `}
                    >
                      <Icon className={`w-6 h-6 ${isJoinCard ? 'text-saffron' : 'text-primary'}`} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {feature.title}
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
                        {canAccessAvailabilityForm ? (
                          <button
                            type="button"
                            onClick={handleToggleAvailabilityForm}
                            className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors
                              ${isAvailabilityActive
                                ? 'text-saffron'
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
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/50 cursor-not-allowed select-none"
                                tabIndex={0}
                              >
                                Find Available Crew
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-[220px] text-center text-xs">
                              {!isAuthenticated
                                ? 'Login as a Director or Production House to access this feature'
                                : 'Only Directors and Production Houses can search for available crew'}
                            </TooltipContent>
                          </Tooltip>
                        )}
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
                      aria-label="Close availability search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="border-t border-border" />

                  {/* Enquiry Form */}
                  <TribeAvailabilityEnquiryForm
                    accountType={accountType}
                    onResults={handleAvailabilityResults}
                  />

                  {/* Results section — shown after submission */}
                  {availabilityResults && (
                    <>
                      <div className="border-t border-border pt-2" />
                      <div className="space-y-3">
                        <h4 className="font-display text-2xl tracking-widest text-foreground">
                          SEARCH RESULTS
                        </h4>
                        <TribeAvailabilityResults
                          results={availabilityResults}
                          shootCity={shootCityForResults}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── FOOTER CTA ── */}
        <section className="bg-primary py-20 px-4 text-center">
          <div className="container mx-auto max-w-2xl space-y-6">
            <h2 className="font-display text-5xl tracking-widest text-primary-foreground">
              READY TO JOIN?
            </h2>
            <p className="text-primary-foreground/75 text-lg">
              The advertising industry&apos;s most connected professionals are already inside.
            </p>
            <div
              className="inline-flex items-center gap-2 bg-saffron/20 border border-saffron/50 rounded-full px-5 py-2 text-sm font-medium text-saffron-light cursor-pointer hover:bg-saffron/30 transition-colors"
              onClick={handleJoinTribeCard}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleJoinTribeCard();
                }
              }}
            >
              Register now
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </section>
      </div>

      {/* ── TRIBAL LEADER REGISTRATION MODAL ── */}
      <TribalLeaderRegistrationModal
        isOpen={isTribalLeaderModalOpen}
        onClose={() => setIsTribalLeaderModalOpen(false)}
        onContinue={handleTribalLeaderContinue}
      />
    </TooltipProvider>
  );
}
