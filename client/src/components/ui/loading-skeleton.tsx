import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("loading-shimmer rounded-md", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glassmorphism rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-12 h-3" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="w-24 h-5" />
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
}

export function NewsSkeleton() {
  return (
    <div className="border-l-4 border-gray-300 pl-4 py-2 space-y-2">
      <div className="flex items-start space-x-3">
        <Skeleton className="w-6 h-6 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-3" />
          <div className="flex items-center justify-between">
            <Skeleton className="w-16 h-3" />
            <Skeleton className="w-20 h-5 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glassmorphism rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="w-24 h-5" />
          <Skeleton className="w-32 h-4" />
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-10 h-6 rounded-lg" />
          ))}
        </div>
      </div>
      <Skeleton className="w-full h-80 rounded-lg" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-16 h-3" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-12 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
