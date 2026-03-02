import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { X, Crown, Film, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TribalRole = 'director' | 'production_house';

interface RoleOption {
  id: TribalRole;
  label: string;
  description: string;
  icon: React.ElementType;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'director',
    label: 'Director',
    description: 'Lead creative vision and direct advertising campaigns.',
    icon: Crown,
  },
  {
    id: 'production_house',
    label: 'Production House',
    description: 'Manage full-scale production for advertising projects.',
    icon: Film,
  },
];

interface TribalLeaderRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (role: TribalRole) => void;
}

export default function TribalLeaderRegistrationModal({
  isOpen,
  onClose,
  onContinue,
}: TribalLeaderRegistrationModalProps) {
  const [selectedRole, setSelectedRole] = useState<TribalRole | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinue = () => {
    if (!selectedRole) return;
    onClose();
    if (selectedRole === 'director') {
      navigate({ to: '/director-registration' });
    } else {
      navigate({ to: '/production-house-registration' });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tribal-modal-title"
    >
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-saffron/15 flex items-center justify-center">
              <Crown className="w-5 h-5 text-saffron" />
            </div>
            <h2
              id="tribal-modal-title"
              className="font-display text-2xl tracking-widest text-foreground"
            >
              START YOUR TRIBE
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Choose your role to begin your registration as a Tribal Leader.
          </p>
        </div>

        {/* Role options */}
        <div className="px-6 py-5 space-y-3">
          {ROLE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedRole === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedRole(option.id)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200
                  ${
                    isSelected
                      ? 'border-saffron bg-saffron/8 shadow-saffron'
                      : 'border-border hover:border-saffron/40 hover:bg-saffron/5'
                  }
                `}
              >
                {/* Radio indicator */}
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${isSelected ? 'border-saffron' : 'border-muted-foreground/40'}
                  `}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-saffron" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                    ${isSelected ? 'bg-saffron/20' : 'bg-muted'}
                  `}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isSelected ? 'text-saffron' : 'text-muted-foreground'
                    }`}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm transition-colors ${
                      isSelected ? 'text-foreground' : 'text-foreground/80'
                    }`}
                  >
                    {option.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 bg-saffron hover:bg-saffron-dark text-forest-deep border-0 shadow-saffron font-semibold"
            disabled={!selectedRole}
            onClick={handleContinue}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
