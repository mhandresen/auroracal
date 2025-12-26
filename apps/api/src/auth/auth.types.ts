import type { TenantRole } from '@prisma/client';

export type AuthContext = {
  userId: string;
  tenantId: string;
  role: TenantRole;
};
