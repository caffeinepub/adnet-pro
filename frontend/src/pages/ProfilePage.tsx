import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Variant_professional_vendor_productionHouse_location } from '../backend';
import ProfessionalProfileForm from '../components/profiles/ProfessionalProfileForm';
import VendorProfileForm from '../components/profiles/VendorProfileForm';
import LocationProfileForm from '../components/profiles/LocationProfileForm';
import ProductionHouseProfileForm from '../components/profiles/ProductionHouseProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (!identity) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Setup Required</CardTitle>
            <CardDescription>Please complete your profile setup to continue</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your professional profile and availability</p>
      </div>

      {userProfile.profileType === Variant_professional_vendor_productionHouse_location.professional && (
        <ProfessionalProfileForm />
      )}
      {userProfile.profileType === Variant_professional_vendor_productionHouse_location.vendor && <VendorProfileForm />}
      {userProfile.profileType === Variant_professional_vendor_productionHouse_location.location && (
        <LocationProfileForm />
      )}
      {userProfile.profileType === Variant_professional_vendor_productionHouse_location.productionHouse && (
        <ProductionHouseProfileForm />
      )}
    </div>
  );
}
