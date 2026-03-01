export default function AvailabilityLegend() {
  return (
    <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-green-500/20 border border-border" />
        <span className="text-sm text-muted-foreground">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-amber-500/20 border border-border" />
        <span className="text-sm text-muted-foreground">Booked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-red-500/20 border border-border" />
        <span className="text-sm text-muted-foreground">Unavailable</span>
      </div>
    </div>
  );
}
