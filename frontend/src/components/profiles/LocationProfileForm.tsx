import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetShootLocation, useSetShootLocation } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AvailabilityCalendar from '../calendar/AvailabilityCalendar';
import { toast } from 'sonner';
import type { ShootLocation, CalendarAvailability } from '../../backend';

export default function LocationProfileForm() {
  const { identity } = useInternetIdentity();
  const { data: existingProfile } = useGetShootLocation(identity?.getPrincipal() || null);
  const setProfile = useSetShootLocation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [pricing, setPricing] = useState('');
  const [availability, setAvailability] = useState<CalendarAvailability[]>([]);

  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.name);
      setDescription(existingProfile.description);
      setCapacity(existingProfile.capacity.toString());
      setPricing(existingProfile.pricing.toString());
      setAvailability(existingProfile.availability);
    }
  }, [existingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const profile: ShootLocation = {
      id: identity.getPrincipal(),
      name,
      description,
      capacity: BigInt(capacity || '0'),
      pricing: BigInt(pricing || '0'),
      availability,
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
          <CardTitle>Location Information</CardTitle>
          <CardDescription>Your shoot location details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Location Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your location, amenities, and features"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (people)</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricing">Daily Rate ($)</Label>
              <Input
                id="pricing"
                type="number"
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Availability Calendar</CardTitle>
          <CardDescription>Set location availability for upcoming shoots</CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityCalendar availability={availability} onAvailabilityChange={setAvailability} />
        </CardContent>
      </Card>

      <Button type="submit" disabled={setProfile.isPending} className="w-full">
        {setProfile.isPending ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
}
