import { endpoints } from "@/lib/endpoints";
import { User as AdminUser } from "@workspace/database";
import { apiClient } from "./api";

export const USERS_QUERY_KEY = ["users"] as const;

type FetchUsersParams = {
  search?: string;
  role?: string;
  status?: string;
  limit?: number;
  offset?: number;
};

export async function fetchUsers(
  cookieHeader?: string,
  params?: FetchUsersParams,
): Promise<AdminUser[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role && params.role !== "all") query.set("role", params.role);
  if (params?.status && params.status !== "all") query.set("status", params.status);
  if (params?.limit != null) query.set("limit", String(params.limit));
  if (params?.offset != null) query.set("offset", String(params.offset));

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api${endpoints.users.list}${query.size ? `?${query}` : ""}`;

  const res = await fetch(url, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Failed to fetch users (${res.status})`);
  }

  const { data }: { data: AdminUser[] } = await res.json();
  return data;
}

export async function createAdmin({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
}): Promise<AdminUser> {
  const { data } = await apiClient.post<AdminUser>(endpoints.users.create, {
    email,
    firstName,
    lastName,
  });
  return data;
}

export async function updateStatus({
  id,
  status,
}: {
  id: string;
  status: string;
}): Promise<AdminUser> {
  const { data } = await apiClient.patch<{ data: AdminUser }>(
    endpoints.users.updateStatus(id),
    { status },
  );
  return data.data;
}
