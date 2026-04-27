export const RESOURCES = ["admin"] as const;
export type Resource = (typeof RESOURCES)[number];

export const ACTIONS = ["create", "read", "update", "delete"] as const;
export type Action = (typeof ACTIONS)[number];

export const SUPER_ADMIN_PERMISSIONS: {
  resource: Resource;
  actions: Action[];
}[] = [{ resource: "admin", actions: ["create", "read", "update", "delete"] }];

export const DEFAULT_ADMIN_PERMISSIONS: {
  resource: Resource;
  actions: Action[];
}[] = [{ resource: "admin", actions: ["read"] }];
