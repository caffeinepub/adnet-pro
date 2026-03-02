import { useNavigate } from '@tanstack/react-router';
import ProductionHouseRegistrationForm from '../components/registration/ProductionHouseRegistrationForm';

export default function ProductionHouseRegistrationPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="font-display text-5xl tracking-widest text-foreground">
            BE THE TRIBAL LEADER
          </h1>
          <p className="text-muted-foreground text-base">
            Register your Production House and lead full-scale advertising productions within the AD TRIBE community.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-forest">
          <ProductionHouseRegistrationForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
