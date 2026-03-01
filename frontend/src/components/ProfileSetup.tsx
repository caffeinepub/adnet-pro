import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Variant_professional_vendor_productionHouse_location } from '../backend';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [profileType, setProfileType] = useState<Variant_professional_vendor_productionHouse_location>(
    Variant_professional_vendor_productionHouse_location.professional
  );
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await saveProfile.mutateAsync({ name: name.trim(), profileType });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to AdNet Pro</DialogTitle>
          <DialogDescription>
            Let's set up your profile. Choose your account type and enter your name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Account Type</Label>
            <RadioGroup value={profileType} onValueChange={(value) => setProfileType(value as Variant_professional_vendor_productionHouse_location)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Variant_professional_vendor_productionHouse_location.professional} id="professional" />
                <Label htmlFor="professional" className="font-normal cursor-pointer">
                  Advertising Professional
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Variant_professional_vendor_productionHouse_location.vendor} id="vendor" />
                <Label htmlFor="vendor" className="font-normal cursor-pointer">
                  Equipment Vendor
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Variant_professional_vendor_productionHouse_location.location} id="location" />
                <Label htmlFor="location" className="font-normal cursor-pointer">
                  Shoot Location
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={Variant_professional_vendor_productionHouse_location.productionHouse} id="productionHouse" />
                <Label htmlFor="productionHouse" className="font-normal cursor-pointer">
                  Production House
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={saveProfile.isPending || !name.trim()}>
            {saveProfile.isPending ? 'Creating Profile...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
