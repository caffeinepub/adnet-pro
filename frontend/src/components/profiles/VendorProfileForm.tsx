import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function VendorProfileForm() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Profile</CardTitle>
        <CardDescription>
          Equipment vendor profiles are managed through the registration flow.
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
