export function JobCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex gap-2 mb-3">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="skeleton h-5 w-3/4 rounded mb-2" />
      <div className="skeleton h-4 w-1/2 rounded mb-4" />
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="skeleton h-3 rounded" />
        <div className="skeleton h-3 rounded" />
        <div className="skeleton h-3 rounded" />
        <div className="skeleton h-3 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-9 flex-1 rounded-lg" />
        <div className="skeleton h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return <div className="skeleton h-24 rounded-xl" />;
}
