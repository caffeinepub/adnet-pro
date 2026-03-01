import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSendRecommendation } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { AdvertisingProfessional, EquipmentVendor, ShootLocation } from '../../backend';
import { Variant_booked_available_unavailable } from '../../backend';

interface ProviderCardProps {
  provider: AdvertisingProfessional | EquipmentVendor | ShootLocation;
  type: 'professional' | 'vendor' | 'location';
}

export default function ProviderCard({ provider, type }: ProviderCardProps) {
  const sendConnection = useSendRecommendation();

  const handleConnect = async () => {
    try {
      await sendConnection.mutateAsync({
        toUser: provider.id,
        message: 'I would like to connect with you for potential collaboration.',
      });
      toast.success('Connection request sent');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send connection request');
    }
  };

  const availableCount = provider.availability.filter(
    (a) => a.status === Variant_booked_available_unavailable.available
  ).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{provider.name}</CardTitle>
            <CardDescription className="capitalize">{type}</CardDescription>
          </div>
          <Badge variant={availableCount > 0 ? 'default' : 'secondary'}>
            {availableCount > 0 ? `${availableCount} days available` : 'No availability'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === 'professional' && 'specialties' in provider && (
          <div>
            <p className="text-sm font-medium mb-2">Specialties:</p>
            <div className="flex flex-wrap gap-1">
              {provider.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {provider.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{provider.specialties.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {type === 'vendor' && 'inventory' in provider && (
          <div>
            <p className="text-sm font-medium mb-2">Equipment:</p>
            <div className="flex flex-wrap gap-1">
              {provider.inventory.slice(0, 3).map((item) => (
                <Badge key={item} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
              {provider.inventory.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{provider.inventory.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {type === 'location' && 'capacity' in provider && (
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Capacity:</span> {provider.capacity.toString()} people
            </p>
            <p className="text-sm">
              <span className="font-medium">Daily Rate:</span> ${provider.pricing.toString()}
            </p>
          </div>
        )}

        <Button onClick={handleConnect} disabled={sendConnection.isPending} className="w-full" size="sm">
          {sendConnection.isPending ? 'Sending...' : 'Send Connection Request'}
        </Button>
      </CardContent>
    </Card>
  );
}
