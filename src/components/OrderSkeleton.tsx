import { Skeleton } from '@/components/ui/skeleton';

export const OrderCardSkeleton = () => (
  <div className="card-dark rounded-xl p-5 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-5 h-5 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="space-y-1">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-3 w-36" />
    </div>
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center flex-1">
          <Skeleton className="w-3 h-3 rounded-full" />
          {i < 3 && <Skeleton className="flex-1 h-0.5" />}
        </div>
      ))}
    </div>
  </div>
);

export const OrderTableSkeleton = () => (
  <div className="space-y-2">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center gap-4 p-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40 hidden sm:block" />
        <Skeleton className="h-4 w-20 hidden sm:block" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-8 w-36 hidden sm:block" />
      </div>
    ))}
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-2 gap-4">
    {[1, 2].map((i) => (
      <div key={i} className="card-dark rounded-xl p-5 text-center space-y-2">
        <Skeleton className="w-8 h-8 rounded-full mx-auto" />
        <Skeleton className="h-6 w-12 mx-auto" />
        <Skeleton className="h-3 w-20 mx-auto" />
      </div>
    ))}
  </div>
);
