import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetAdvertisingProfessional, useSetAdvertisingProfessional } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import AvailabilityCalendar from '../calendar/AvailabilityCalendar';
import { toast } from 'sonner';
import type { AdvertisingProfessional, CalendarAvailability } from '../../backend';

export default function ProfessionalProfileForm() {
  const { identity } = useInternetIdentity();
  const { data: existingProfile } = useGetAdvertisingProfessional(identity?.getPrincipal() || null);
  const setProfile = useSetAdvertisingProfessional();

  const [name, setName] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [portfolioInput, setPortfolioInput] = useState('');
  const [availability, setAvailability] = useState<CalendarAvailability[]>([]);

  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.name);
      setSpecialties(existingProfile.specialties);
      setPortfolio(existingProfile.portfolio);
      setAvailability(existingProfile.availability);
    }
  }, [existingProfile]);

  const addSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  const addPortfolioItem = () => {
    if (portfolioInput.trim() && !portfolio.includes(portfolioInput.trim())) {
      setPortfolio([...portfolio, portfolioInput.trim()]);
      setPortfolioInput('');
    }
  };

  const removePortfolioItem = (item: string) => {
    setPortfolio(portfolio.filter((p) => p !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const profile: AdvertisingProfessional = {
      id: identity.getPrincipal(),
      name,
      specialties,
      portfolio,
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
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Your details as an advertising professional</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Specialties</Label>
            <div className="flex gap-2">
              <Input
                id="specialty"
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                placeholder="e.g., Director, Cinematographer"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSpecialty();
                  }
                }}
              />
              <Button type="button" onClick={addSpecialty} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary">
                  {specialty}
                  <button type="button" onClick={() => removeSpecialty(specialty)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio Links</Label>
            <div className="flex gap-2">
              <Input
                id="portfolio"
                value={portfolioInput}
                onChange={(e) => setPortfolioInput(e.target.value)}
                placeholder="e.g., https://portfolio.com"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPortfolioItem();
                  }
                }}
              />
              <Button type="button" onClick={addPortfolioItem} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {portfolio.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                  <button type="button" onClick={() => removePortfolioItem(item)} className="ml-2">
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
          <CardDescription>Set your availability for upcoming shoots</CardDescription>
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
