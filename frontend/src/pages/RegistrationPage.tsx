import { useNavigate } from '@tanstack/react-router';
import InlineRegistrationForm from '../components/registration/InlineRegistrationForm';

export default function RegistrationPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: '/registration/success' });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="font-display text-5xl tracking-widest text-foreground">
            JOIN THE TRIBE
          </h1>
          <p className="text-muted-foreground text-base">
            Tell us about yourself and become part of the AD TRIBE community.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-forest">
          <InlineRegistrationForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
