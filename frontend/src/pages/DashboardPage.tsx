import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Users, UserCheck } from 'lucide-react';

export default function DashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-4xl tracking-widest text-foreground">DASHBOARD</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back{userProfile?.name ? `, ${userProfile.name}` : ''}!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:border-primary/50 hover:shadow-forest transition-all duration-300">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>View and manage your professional registration</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full rounded-full hover:border-primary hover:text-primary"
              onClick={() => navigate({ to: '/profile' })}
            >
              View Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 hover:shadow-forest transition-all duration-300">
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-saffron" />
            </div>
            <CardTitle>The Tribe</CardTitle>
            <CardDescription>Explore verified members of the AD TRIBE community</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full rounded-full hover:border-saffron hover:text-saffron"
              onClick={() => navigate({ to: '/connections' })}
            >
              View Connections
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
