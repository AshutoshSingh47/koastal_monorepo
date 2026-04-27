import { Skeleton } from "@workspace/ui/components/skeleton";

function TableRowSkeleton() {
  return (
    <tr className="border-b last:border-0">
      {/* Member */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </td>
      {/* Role */}
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-20 rounded-full" />
      </td>
      {/* Joined */}
      <td className="px-4 py-3">
        <Skeleton className="h-3.5 w-24" />
      </td>
      {/* Status */}
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <Skeleton className="ml-auto size-8 rounded-md" />
      </td>
    </tr>
  );
}

export default function TeamLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 px-4 pt-6 lg:px-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-24 sm:h-9" />
            <Skeleton className="h-4 w-64 sm:w-80" />
          </div>
          {/* Invite button */}
          <Skeleton className="mt-1 h-9 w-24 shrink-0 rounded-md" />
        </header>

        <div className="flex flex-col gap-4 px-4 pb-6 lg:px-6">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-9 flex-1 rounded-md sm:max-w-72" />
            <Skeleton className="h-9 w-full rounded-md sm:w-40" />
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-3.5 w-16" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-3.5 w-10" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-3.5 w-12" />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <Skeleton className="h-3.5 w-12" />
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="hidden size-8 rounded-md lg:block" />
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="hidden size-8 rounded-md lg:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
