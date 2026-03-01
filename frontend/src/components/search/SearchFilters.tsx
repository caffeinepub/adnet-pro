import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchFiltersProps {
  filterType: 'all' | 'professional' | 'vendor' | 'location';
  setFilterType: (type: 'all' | 'professional' | 'vendor' | 'location') => void;
  dateRange: { start: Date | null; end: Date | null };
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
}

export default function SearchFilters({ filterType, setFilterType }: SearchFiltersProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 space-y-2">
        <Label>Provider Type</Label>
        <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="professional">Professionals</SelectItem>
            <SelectItem value="vendor">Equipment Vendors</SelectItem>
            <SelectItem value="location">Shoot Locations</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
