import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg border border-border bg-card p-4 space-y-3",
        className
      )}
    >
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-3 w-full rounded bg-muted" />
      <div className="h-3 w-1/2 rounded bg-muted" />
    </div>
  );
}

export function MessageListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-6 p-6", className)}>
      <div className="h-8 w-1/3 rounded bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="space-y-4">
        <div className="h-12 w-full rounded bg-muted" />
        <div className="h-12 w-full rounded bg-muted" />
      </div>
    </div>
  );
}
