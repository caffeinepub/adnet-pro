import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSetProductionHouse } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { ProductionHouse } from '../../backend';

export default function ProductionHouseProfileForm() {
  const { identity } = useInternetIdentity();
  const setProfile = useSetProductionHouse();

  const [name, setName] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const profile: ProductionHouse = {
      id: identity.getPrincipal(),
      name,
      companyInfo,
      verifiedConnections: [],
    };

    try {
      await setProfile.mutateAsync(profile);
      toast.success('Profile saved successfully');
    } catch (error) {
      toast.error('Failed to save profile');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Production House Information</CardTitle>
          <CardDescription>Your company details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyInfo">Company Information</Label>
            <Textarea
              id="companyInfo"
              value={companyInfo}
              onChange={(e) => setCompanyInfo(e.target.value)}
              placeholder="Tell us about your production house, services, and experience"
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={setProfile.isPending} className="w-full">
        {setProfile.isPending ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}
