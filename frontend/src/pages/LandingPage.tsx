import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Search, Zap, ArrowRight, Star } from 'lucide-react';
import { Variant_professional_vendor_productionHouse_location } from '../backend';
import { useEffect } from 'react';

const features = [
  {
    icon: Users,
    title: 'Join the Tribe',
    description:
      'Become part of an exclusive community of advertising professionals, vendors, and production houses.',
  },
  {
    icon: Calendar,
    title: 'Tribe Availability',
    description:
      "Sync your calendar with the tribe. Know who's free, when they're free, and book with confidence.",
  },
  {
    icon: Search,
    title: 'Tribe Marketplace',
    description:
      'Discover top-tier talent, premium equipment, and stunning shoot locations \u2014 all within your tribe.',
  },
  {
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
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      if (
        userProfile.profileType ===
        Variant_professional_vendor_productionHouse_location.productionHouse
      ) {
        navigate({ to: '/dashboard' });
      } else {
        navigate({ to: '/profile' });
      }
    }
  }, [isAuthenticated, userProfile, navigate]);

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      login();
    }
  };

  return (
    <div className="space-y-0 -mt-8">
      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden rounded-b-3xl">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(/assets/generated/ad-tribe-hero-bg.dim_1920x1080.png)',
          }}
        />
        {/* Dark overlay with warm tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-deep/90 via-charcoal/80 to-amber-dark/70" />
        {/* Subtle gold shimmer at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 space-y-8">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-full px-4 py-1.5 text-sm font-medium text-amber-light backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-current" />
            The Advertising Industry&apos;s Network
          </div>

          {/* Main headline */}
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

          {/* CTA */}
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={loginStatus === 'logging-in'}
                className="text-base px-8 py-6 rounded-full shadow-amber font-semibold tracking-wide"
              >
                {loginStatus === 'logging-in' ? (
                  'Logging in...'
                ) : (
                  <>
                    Join the Tribe
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
              <span className="text-white/50 text-sm">
                Free to join &middot; No credit card required
              </span>
            </div>
          )}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-primary/50 hover:shadow-amber transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="relative bg-charcoal rounded-3xl overflow-hidden px-8 py-16 text-center space-y-6">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-gold/10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <h2 className="font-display text-5xl md:text-6xl tracking-widest text-white">
                READY TO CREATE?
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Join AD TRIBE today and connect with the best talent, equipment,
                and locations in the advertising industry.
              </p>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  disabled={loginStatus === 'logging-in'}
                  className="text-base px-10 py-6 rounded-full shadow-amber font-semibold tracking-wide mt-2"
                >
                  {loginStatus === 'logging-in' ? (
                    'Logging in...'
                  ) : (
                    <>
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
