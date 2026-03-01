import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function LocationProfileForm() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Profile</CardTitle>
        <CardDescription>
          Shoot location profiles are managed through the registration flow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="shadow-amber rounded-full"
          onClick={() => navigate({ to: '/registration' })}
        >
          Go to Registration
        </Button>
      </CardContent>
    </Card>
  );
}
