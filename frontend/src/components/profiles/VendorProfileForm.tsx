import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetEquipmentVendor, useSetEquipmentVendor } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import AvailabilityCalendar from '../calendar/AvailabilityCalendar';
import { toast } from 'sonner';
import type { EquipmentVendor, CalendarAvailability } from '../../backend';

export default function VendorProfileForm() {
  const { identity } = useInternetIdentity();
  const { data: existingProfile } = useGetEquipmentVendor(identity?.getPrincipal() || null);
  const setProfile = useSetEquipmentVendor();

  const [name, setName] = useState('');
  const [inventory, setInventory] = useState<string[]>([]);
  const [inventoryInput, setInventoryInput] = useState('');
  const [availability, setAvailability] = useState<CalendarAvailability[]>([]);

  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.name);
      setInventory(existingProfile.inventory);
      setAvailability(existingProfile.availability);
    }
  }, [existingProfile]);

  const addInventoryItem = () => {
    if (inventoryInput.trim() && !inventory.includes(inventoryInput.trim())) {
      setInventory([...inventory, inventoryInput.trim()]);
      setInventoryInput('');
    }
  };

  const removeInventoryItem = (item: string) => {
    setInventory(inventory.filter((i) => i !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const profile: EquipmentVendor = {
      id: identity.getPrincipal(),
      name,
      inventory,
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
          <CardTitle>Vendor Information</CardTitle>
          <CardDescription>Your equipment vendor details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory">Equipment Inventory</Label>
            <div className="flex gap-2">
              <Input
                id="inventory"
                value={inventoryInput}
                onChange={(e) => setInventoryInput(e.target.value)}
                placeholder="e.g., RED Camera, Lighting Kit"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addInventoryItem();
                  }
                }}
              />
              <Button type="button" onClick={addInventoryItem} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {inventory.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                  <button type="button" onClick={() => removeInventoryItem(item)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Availability Calendar</CardTitle>
          <CardDescription>Set equipment availability for upcoming shoots</CardDescription>
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
