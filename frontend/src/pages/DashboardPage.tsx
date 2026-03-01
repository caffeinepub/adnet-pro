import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Variant_professional_vendor_productionHouse_location } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SearchBar from '../components/search/SearchBar';
import SearchFilters from '../components/search/SearchFilters';
import SearchResults from '../components/search/SearchResults';
import { useState } from 'react';

export default function DashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'professional' | 'vendor' | 'location'>('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  if (userProfile?.profileType !== Variant_professional_vendor_productionHouse_location.productionHouse) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This dashboard is only available to production houses</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Production Dashboard</h1>
        <p className="text-muted-foreground mt-2">Search and connect with professionals, vendors, and locations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Service Providers</CardTitle>
          <CardDescription>Find the perfect match for your production needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <SearchFilters
            filterType={filterType}
            setFilterType={setFilterType}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </CardContent>
      </Card>

      <SearchResults searchQuery={searchQuery} filterType={filterType} dateRange={dateRange} />
    </div>
  );
}
