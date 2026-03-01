import { Skeleton } from '@/components/ui/skeleton';

interface SearchResultsProps {
  searchQuery: string;
  filterType: 'all' | 'professional' | 'vendor' | 'location';
  dateRange: { start: Date | null; end: Date | null };
}

export default function SearchResults({ searchQuery, filterType }: SearchResultsProps) {
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground text-sm">
        {searchQuery
          ? `No results found for "${searchQuery}". Try adjusting your search.`
          : 'Search for advertising professionals, vendors, and locations.'}
      </p>
    </div>
  );
}
