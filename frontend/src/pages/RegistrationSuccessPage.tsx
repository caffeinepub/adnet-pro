import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Users, ArrowRight } from 'lucide-react';

export default function RegistrationSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-saffron/15 flex items-center justify-center shadow-saffron">
            <CheckCircle2 className="w-12 h-12 text-saffron" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="font-display text-5xl tracking-widest text-foreground">
            YOU'RE IN THE TRIBE!
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Welcome to AD TRIBE. Your professional profile has been submitted successfully.
            We're thrilled to have you as part of the community.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-left">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground text-sm">What's next?</p>
              <p className="text-muted-foreground text-sm mt-1">
                Explore the dashboard to discover talent, equipment, and locations. Connect with
                other professionals and start building your tribe.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="rounded-full font-semibold tracking-wide shadow-saffron px-8 bg-saffron hover:bg-saffron-dark text-forest-deep border-0"
            onClick={() => navigate({ to: '/dashboard' })}
          >
            Explore Dashboard
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full font-semibold tracking-wide px-8 hover:border-primary hover:text-primary"
            onClick={() => navigate({ to: '/profile' })}
          >
            View My Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
