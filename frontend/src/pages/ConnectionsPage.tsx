import { useGetCallerUserProfile, useGetVerifiedMembers } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

export default function ConnectionsPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: verifiedMembers = [], isLoading } = useGetVerifiedMembers();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-widest text-foreground">CONNECTIONS</h1>
        <p className="text-muted-foreground mt-2">
          Welcome{userProfile?.fullName ? `, ${userProfile.fullName}` : ''}. Explore your professional network.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Verified Members</CardTitle>
              <CardDescription>Advertising professionals verified in the AD TRIBE community</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : verifiedMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No verified members yet. Be the first to join!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {verifiedMembers.map((principal) => (
                <div
                  key={principal.toString()}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-background"
                >
                  <span className="text-sm font-mono text-muted-foreground truncate max-w-xs">
                    {principal.toString()}
                  </span>
                  <Badge className="shrink-0 ml-2 bg-saffron text-forest-deep hover:bg-saffron-dark border-0">
                    Verified
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
