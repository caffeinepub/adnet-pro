import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProviderCardProps {
  name: string;
  type: string;
  description?: string;
  tags?: string[];
}

export default function ProviderCard({ name, type, description, tags = [] }: ProviderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription className="capitalize">{type}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
