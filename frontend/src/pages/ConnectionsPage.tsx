import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Variant_professional_vendor_productionHouse_location } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ConnectionsPage() {
  const { data: userProfile } = useGetCallerUserProfile();

  const isProductionHouse = userProfile?.profileType === Variant_professional_vendor_productionHouse_location.productionHouse;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="text-muted-foreground mt-2">Manage your professional network</p>
      </div>

      <Tabs defaultValue={isProductionHouse ? 'sent' : 'received'}>
        <TabsList className="grid w-full grid-cols-2">
          {!isProductionHouse && <TabsTrigger value="received">Requests Received</TabsTrigger>}
          <TabsTrigger value="sent">{isProductionHouse ? 'Sent Requests' : 'My Connections'}</TabsTrigger>
        </TabsList>

        {!isProductionHouse && (
          <TabsContent value="received">
            <Card>
              <CardHeader>
                <CardTitle>Connection Requests</CardTitle>
                <CardDescription>Production houses that want to connect with you</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No pending connection requests</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <CardTitle>{isProductionHouse ? 'Your Connections' : 'Connected Production Houses'}</CardTitle>
              <CardDescription>
                {isProductionHouse
                  ? 'Service providers you are connected with'
                  : 'Production houses you are connected with'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No connections yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
