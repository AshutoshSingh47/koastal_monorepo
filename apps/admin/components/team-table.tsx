"use client";

import { fetchUsers, updateStatus, USERS_QUERY_KEY } from "@/lib/users.api";
import { RoleBadge } from "@/components/role-badge";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CircleCheck,
  Clock3,
  Clock4,
  DotIcon,
  EllipsisVerticalIcon,
  Minus,
  SearchIcon,
  Shield,
  ShieldCheck,
  ShieldUser,
  Trash,
  TriangleAlert,
  User,
  UserRound,
} from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { formatLabel, useDebounce } from "@/utils/helpers";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { getInitials } from "@/utils/helpers";
import { User as AdminUser, Status, Role } from "@workspace/database";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";

// type TeamMember = Omit<AdminUser, "image" | "updatedAt">;

// function TableRowSkeleton() {
//   return (
//     <TableRow>
//       <TableCell className="px-4 py-3">
//         <div className="flex items-center gap-3">
//           <Skeleton className="size-8 shrink-0 rounded-full" />
//           <div className="flex flex-col gap-1.5">
//             <Skeleton className="h-3.5 w-28" />
//             <Skeleton className="h-3 w-36" />
//           </div>
//         </div>
//       </TableCell>
//       <TableCell className="px-4 py-3">
//         <Skeleton className="h-5 w-20 rounded-full" />
//       </TableCell>
//       <TableCell className="px-4 py-3">
//         <Skeleton className="h-3.5 w-24" />
//       </TableCell>
//       <TableCell className="px-4 py-3">
//         <Skeleton className="h-5 w-16 rounded-full" />
//       </TableCell>
//       <TableCell className="px-4 py-3 text-right">
//         <Skeleton className="ml-auto size-8 rounded-md" />
//       </TableCell>
//     </TableRow>
//   );
// }

// const STATUS_OPTIONS: Record<
//   string,
//   { label: string; nextStatus: string; destructive?: boolean }[]
// > = {
//   PENDING: [
//     { label: "Approve", nextStatus: "ACTIVE" },
//     { label: "Delete Account", nextStatus: "DEACTIVATED", destructive: true },
//   ],
//   ACTIVE: [
//     { label: "Block", nextStatus: "BLOCKED", destructive: true },
//     { label: "Delete Account", nextStatus: "DEACTIVATED", destructive: true },
//   ],
//   BLOCKED: [
//     { label: "Unblock", nextStatus: "ACTIVE" },
//     { label: "Delete Account", nextStatus: "DEACTIVATED", destructive: true },
//   ],
// };

// function MemberActions({
//   member,
//   currentUserId,
//   onStatusChange,
//   isPending,
// }: {
//   member: TeamMember;
//   currentUserId: string;
//   onStatusChange: (id: string, status: string) => Promise<void>;
//   isPending: boolean;
// }) {
//   const isSelf = member.id === currentUserId;
//   const allOptions = STATUS_OPTIONS[member.status] ?? [];
//   const statusOptions = isSelf
//     ? allOptions.filter((o) => !o.destructive)
//     : allOptions;

//   const nonDestructive = statusOptions.filter((o) => !o.destructive);
//   const destructive = statusOptions.filter((o) => o.destructive);

//   return (
//     <div className="flex items-center justify-end gap-1">
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-muted-foreground size-8"
//           >
//             <EllipsisVerticalIcon className="size-4" />
//             <span className="sr-only">More options</span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           align="end"
//           className="w-40 **:[[role=menuitem]]:cursor-pointer"
//         >
//           <DropdownMenuItem
//             onClick={() => toast.info("View profile — coming soon")}
//           >
//             View profile
//           </DropdownMenuItem>
//           {nonDestructive.length > 0 && (
//             <>
//               {nonDestructive.map((option) => (
//                 <DropdownMenuItem
//                   key={option.nextStatus}
//                   disabled={isPending}
//                   onClick={() => onStatusChange(member.id, option.nextStatus)}
//                 >
//                   {option.label}
//                 </DropdownMenuItem>
//               ))}
//             </>
//           )}
//           {destructive.length > 0 && (
//             <>
//               <DropdownMenuSeparator />
//               {destructive.map((option) => (
//                 <DropdownMenuItem
//                   key={option.nextStatus}
//                   disabled={isPending}
//                   variant="destructive"
//                   className="dark:data-[variant=destructive]:text-red-400 dark:data-[variant=destructive]:focus:text-red-400"
//                   onClick={() => onStatusChange(member.id, option.nextStatus)}
//                 >
//                   {option.label}
//                 </DropdownMenuItem>
//               ))}
//             </>
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

// const PAGE_SIZE = 10;

// export function TeamTable() {
//   const [search, setSearch] = useQueryState(
//     "search",
//     parseAsString.withDefault(""),
//   );
//   const [role, setRole] = useQueryState(
//     "role",
//     parseAsString.withDefault("all"),
//   );
//   const [status, setStatus] = useQueryState(
//     "status",
//     parseAsString.withDefault("all"),
//   );
//   const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
//   const [sorting, setSorting] = useState<SortingState>([]);

//   const debouncedSearch = useDebounce(search, 400);
//   const user = useAuthStore((s) => s.user);
//   const queryClient = useQueryClient();

//   const { mutateAsync, isPending } = useMutation({
//     mutationFn: updateStatus,
//     onSuccess: (updatedUser) => {
//       queryClient.setQueryData<AdminUser[]>(USERS_QUERY_KEY, (old = []) =>
//         old.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
//       );
//     },
//   });

//   const handleStatusChange = useCallback(
//     async (id: string, status: string) => {
//       try {
//         await mutateAsync({ id, status });
//         toast.success("Status updated");
//       } catch (error) {
//         toast.error("Failed to update status", {
//           description: (error as Error).message,
//         });
//       }
//     },
//     [mutateAsync],
//   );

//   const columns = useMemo<ColumnDef<TeamMember>[]>(
//     () => [
//       {
//         id: "member",
//         accessorFn: (row) =>
//           [row.firstName, row.lastName, row.email].filter(Boolean).join(" "),
//         header: "Member",
//         cell: ({ row }) => {
//           const { firstName, lastName, email } = row.original;
//           const fullName =
//             [firstName, lastName].filter(Boolean).join(" ") || "—";
//           return (
//             <div className="flex items-center gap-3">
//               <Avatar className="size-8 shrink-0">
//                 <AvatarFallback className="text-xs font-medium">
//                   {getInitials(firstName, lastName)}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex min-w-0 flex-col">
//                 <span className="truncate text-sm font-medium">{fullName}</span>
//                 <span className="text-muted-foreground truncate text-xs">
//                   {email}
//                 </span>
//               </div>
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: "role",
//         header: "Role",
//         cell: ({ row }) => <RoleBadge role={row.original.role} />,
//         filterFn: (row, _, filterValue) => {
//           if (!filterValue || filterValue === "all") return true;
//           return row.original.role === filterValue;
//         },
//       },
//       {
//         accessorKey: "createdAt",
//         header: "Joined",
//         cell: ({ row }) => (
//           <span className="text-muted-foreground text-sm">
//             {new Date(row.original.createdAt).toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//               year: "numeric",
//             })}
//           </span>
//         ),
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//         cell: ({ row }) => {
//           const { status } = row.original;
//           const styles = {
//             ACTIVE:
//               "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//             PENDING:
//               "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
//             BLOCKED:
//               "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//           };
//           return (
//             <span
//               className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
//             >
//               {status.charAt(0) + status.slice(1).toLowerCase()}
//             </span>
//           );
//         },
//       },
//       {
//         id: "actions",
//         header: () => <span className="sr-only">Actions</span>,
//         cell: ({ row }) => (
//           <MemberActions
//             member={row.original}
//             currentUserId={user?.id ?? ""}
//             onStatusChange={handleStatusChange}
//             isPending={isPending}
//           />
//         ),
//       },
//     ],
//     [user?.id, isPending, handleStatusChange],
//   );

//   // nuqs is 1-indexed, TanStack Table is 0-indexed
//   const pageIndex = Math.max(0, page - 1);

//   const {
//     data = [],
//     isFetching,
//     isLoading,
//   } = useQuery({
//     queryKey: [
//       USERS_QUERY_KEY,
//       { search: debouncedSearch, role, status, page },
//     ],
//     queryFn: () =>
//       fetchUsers(undefined, {
//         search: debouncedSearch || undefined,
//         role: role !== "all" ? role : undefined,
//         status: status !== "all" ? status : undefined,
//         limit: PAGE_SIZE,
//         offset: pageIndex * PAGE_SIZE,
//       }),
//     staleTime: Infinity,
//     placeholderData: (prev) => prev,
//   });

//   // True only during background refetches (data already in cache from SSR)
//   const isRefetching = isFetching && !isLoading;

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       pagination: { pageIndex, pageSize: PAGE_SIZE },
//     },
//     onSortingChange: setSorting,
//     autoResetPageIndex: false,
//     manualPagination: true,
//     manualFiltering: true,
//     onPaginationChange: (updater) => {
//       const next =
//         typeof updater === "function"
//           ? updater({ pageIndex, pageSize: PAGE_SIZE })
//           : updater;
//       setPage(next.pageIndex + 1);
//     },
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   const handleRoleFilter = (value: string) => {
//     setRole(value);
//     setPage(null);
//   };

//   const handleStatusFilter = (value: string) => {
//     setStatus(value);
//     setPage(null);
//   };

//   const totalCount = data.length;

//   return (
//     <div className="flex flex-col gap-4 px-4 pb-6 lg:px-6">
//       {/* Toolbar */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//         <div className="relative flex-1 sm:max-w-72">
//           <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2 pointer-events-none" />
//           <Input
//             placeholder="Search members..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value || null);
//               setPage(null);
//             }}
//             className="pl-9"
//           />
//         </div>
//         <Select value={role} onValueChange={handleRoleFilter}>
//           <SelectTrigger className="w-full sm:w-40">
//             <SelectValue placeholder="All roles" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="all">All roles</SelectItem>
//               <SelectItem value="ADMIN">Admin</SelectItem>
//               <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//         <Select value={status} onValueChange={handleStatusFilter}>
//           <SelectTrigger className="w-full sm:w-40">
//             <SelectValue placeholder="All status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="all">All status</SelectItem>
//               <SelectItem value="ACTIVE">Active</SelectItem>
//               <SelectItem value="PENDING">Pending</SelectItem>
//               <SelectItem value="BLOCKED">Blocked</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-lg border">
//         <Table>
//           <TableHeader className="bg-muted sticky top-0 z-10">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext(),
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {isRefetching ? (
//               Array.from({ length: PAGE_SIZE }).map((_, i) => (
//                 <TableRowSkeleton key={i} />
//               ))
//             ) : table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext(),
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="text-muted-foreground h-24 text-center"
//                 >
//                   No members found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-between">
//         <p className="text-muted-foreground text-sm">
//           {totalCount} member{totalCount !== 1 ? "s" : ""}
//         </p>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="icon"
//             className="hidden size-8 lg:flex"
//             onClick={() => table.setPageIndex(0)}
//             disabled={!table.getCanPreviousPage()}
//           >
//             <ChevronsLeftIcon className="size-4" />
//             <span className="sr-only">First page</span>
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="size-8"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             <ChevronLeftIcon className="size-4" />
//             <span className="sr-only">Previous page</span>
//           </Button>
//           <span className="text-muted-foreground text-sm">
//             Page {table.getState().pagination.pageIndex + 1} of{" "}
//             {table.getPageCount() || 1}
//           </span>
//           <Button
//             variant="outline"
//             size="icon"
//             className="size-8"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             <ChevronRightIcon className="size-4" />
//             <span className="sr-only">Next page</span>
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="hidden size-8 lg:flex"
//             onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//             disabled={!table.getCanNextPage()}
//           >
//             <ChevronsRightIcon className="size-4" />
//             <span className="sr-only">Last page</span>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

interface ColumnDef<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
}

const statusConfig: Record<
  Status,
  { icon: LucideIcon; iconStyle: string; badgeStyle: string }
> = {
  ACTIVE: {
    icon: CircleCheck,
    iconStyle: "text-green-700 dark:text-green-400",
    badgeStyle:
      "border-green-600/30 bg-green-600/10 dark:border-green-500/30 dark:bg-green-500/10",
  },
  PENDING: {
    icon: Clock4,
    iconStyle: "text-yellow-700 dark:text-yellow-400",
    badgeStyle:
      "border-yellow-600/30 bg-yellow-500/10 dark:border-yellow-500/30 dark:bg-yellow-500/10",
  },
  BLOCKED: {
    icon: TriangleAlert,
    iconStyle: "text-red-700 dark:text-red-400",
    badgeStyle:
      "border-red-600/30 bg-red-500/10 dark:border-red-500/30 dark:bg-red-500/10",
  },
  DEACTIVATED: {
    icon: Minus,
    iconStyle: "text-gray-600 dark:text-gray-400",
    badgeStyle:
      "border-gray-500/30 bg-gray-500/10 dark:border-gray-400/20 dark:bg-gray-400/10",
  },
};

const roleConfig: Record<
  Role,
  { icon: LucideIcon; iconStyle: string; badgeStyle: string }
> = {
  ADMIN: {
    icon: Shield,
    iconStyle: "",
    badgeStyle: "text-muted-foreground",
  },
  SUPER_ADMIN: {
    icon: ShieldCheck,
    iconStyle: "text-cyan-600 dark:text-cyan-400",
    badgeStyle: "text-black dark:text-white",
  },
};

export function TeamTable() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const [role, setRole] = useQueryState(
    "role",
    parseAsString.withDefault("all"),
  );
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );

  const user = useAuthStore((s) => s.user);

  function displayMember(
    firstName: string | null,
    lastName: string | null,
    fullName: string | null,
    email: string,
  ) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="text-xs font-medium">
            {getInitials(firstName, lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">
              {fullName ?? ""}
            </span>
            {user?.email === email && (
              <div className="rounded-sm px-1.5 py-0.5 text-[11px] border border-cyan-600/30 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300">
                You
              </div>
            )}
          </div>
          <span className="text-muted-foreground truncate text-xs">
            {email}
          </span>
        </div>
      </div>
    );
  }

  function displayRole(role: Role) {
    const { icon: Icon, iconStyle, badgeStyle } = roleConfig[role];

    return (
      <div className={`flex items-center gap-2 ${badgeStyle}`}>
        <Icon className={`${iconStyle} size-3.5`} />
        {formatLabel(role)}
      </div>
    );
  }

  function displayJoiningDate(date: Date | string) {
    return (
      <span className="text-muted-foreground text-sm">
        {new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    );
  }

  function displayStatus(status: Status) {
    const { icon: Icon, iconStyle, badgeStyle } = statusConfig[status];
    const label = formatLabel(status);

    return (
      <Badge
        variant={"ghost"}
        className={`inline-flex items-center rounded-full gap-2 px-2.5 py-3 text-xs font-medium ${badgeStyle}`}
      >
        <Icon className={iconStyle} />
        {label}
      </Badge>
    );
  }

  const userTableConfig: { columns: ColumnDef<AdminUser>[] } = {
    columns: [
      {
        key: "member",
        header: "Member",
        cell: (user) =>
          displayMember(
            user.firstName ?? "",
            user.lastName ?? "",
            user.name ?? "",
            user.email,
          ),
      },
      {
        key: "role",
        header: "Role",
        cell: (user) => displayRole(user.role),
      },
      {
        key: "joined",
        header: "Joined",
        cell: (user) => displayJoiningDate(user.createdAt),
      },
      {
        key: "status",
        header: "Status",
        cell: (user) => displayStatus(user.status),
      },
    ],
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: [
      USERS_QUERY_KEY,
      { search: search, role: role, status: status, page: 1 },
    ],
    queryFn: () =>
      fetchUsers(undefined, {
        search,
        role,
        status,
        limit: 10,
        offset: 0,
      }),
    staleTime: Infinity,
    placeholderData: (prev) => prev,
  });

  return (
    <div className="flex flex-col gap-4 px-4 pb-6 lg:px-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-72">
          <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value || null);
            }}
            className="pl-9"
          />
        </div>
        <Select value={role} onValueChange={(value) => setRole(value)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All roles</SelectItem>
              {Object.values(Role).map((role) => {
                const { icon: Icon, iconStyle } = roleConfig[role];
                return (
                  <SelectItem key={role} value={role}>
                    <Icon className={`${iconStyle} size-3.5`} />
                    {formatLabel(role)}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All status</SelectItem>
              {Object.values(Status).map((status) => {
                const { icon: Icon, iconStyle } = statusConfig[status];
                return (
                  <SelectItem key={status} value={status}>
                    <Icon className={`size-3.5 ${iconStyle}`} />
                    {formatLabel(status)}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              {userTableConfig.columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {userTableConfig.columns.map((col) => (
                  <TableCell key={col.key}>{col.cell(user)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isRefetching ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div> */}

      {/* Pagination */}
      {/* <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {totalCount} member{totalCount !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="size-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="size-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div> */}
    </div>
  );
}
