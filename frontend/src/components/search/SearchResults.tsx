import { useGetAllAdvertisingProfessionals, useGetAllEquipmentVendors, useGetAllShootLocations } from '../../hooks/useQueries';
import ProviderCard from './ProviderCard';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResultsProps {
  searchQuery: string;
  filterType: 'all' | 'professional' | 'vendor' | 'location';
  dateRange: { start: Date | null; end: Date | null };
}

export default function SearchResults({ searchQuery, filterType }: SearchResultsProps) {
  const { data: professionals = [], isLoading: loadingProfessionals } = useGetAllAdvertisingProfessionals();
  const { data: vendors = [], isLoading: loadingVendors } = useGetAllEquipmentVendors();
  const { data: locations = [], isLoading: loadingLocations } = useGetAllShootLocations();

  const isLoading = loadingProfessionals || loadingVendors || loadingLocations;

  const filteredProfessionals =
    filterType === 'all' || filterType === 'professional'
      ? professionals.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : [];

  const filteredVendors =
    filterType === 'all' || filterType === 'vendor'
      ? vendors.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : [];

  const filteredLocations =
    filterType === 'all' || filterType === 'location'
      ? locations.filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : [];

  const totalResults = filteredProfessionals.length + filteredVendors.length + filteredLocations.length;

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (totalResults === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Found {totalResults} result{totalResults !== 1 ? 's' : ''}
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfessionals.map((professional) => (
          <ProviderCard key={professional.id.toString()} provider={professional} type="professional" />
        ))}
        {filteredVendors.map((vendor) => (
          <ProviderCard key={vendor.id.toString()} provider={vendor} type="vendor" />
        ))}
        {filteredLocations.map((location) => (
          <ProviderCard key={location.id.toString()} provider={location} type="location" />
        ))}
      </div>
    </div>
  );
}
