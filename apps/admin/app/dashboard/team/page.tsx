import { InviteDialog } from "@/components/invite-dialog";
import { TeamTable } from "@/components/team-table";
import { getQueryClient } from "@/lib/query-client";
import { fetchUsers, USERS_QUERY_KEY } from "@/lib/users.api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

export default async function TeamPage() {
  const cookieStore = await cookies();

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      USERS_QUERY_KEY,
      { search: "", role: "all", status: "all", page: 1 },
    ],
    queryFn: () => fetchUsers(cookieStore.toString(), { limit: 10, offset: 0 }),
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <header className="flex items-start justify-between gap-4 px-4 pt-6 lg:px-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Team
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your team members and their access levels.
            </p>
          </div>
          <InviteDialog />
        </header>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TeamTable />
        </HydrationBoundary>
      </div>
    </div>
  );
}
