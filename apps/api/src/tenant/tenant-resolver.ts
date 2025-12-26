import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantResolver {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeHost(host: string) {
    return (host || '').toLowerCase().split(':')[0];
  }

  private subdomainFromHost(hostNoPort: string) {
    const base = (process.env.BASE_DOMAIN ?? '').toLowerCase();

    if (!base) return null;
    if (hostNoPort === base) return null;
    if (!hostNoPort.endsWith(`.${base}`)) return null;

    const sub = hostNoPort.slice(0, -(base.length + 1));
    if (!sub || sub === 'www') return null;
    return sub;
  }

  async resolveTenant(opts: { host?: string; tenantSlug?: string }) {
    // Path-base on main domain: auroracal.com/:tenantSlug
    if (opts.tenantSlug) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: opts.tenantSlug.toLowerCase() },
        select: { id: true, slug: true, name: true },
      });

      if (tenant) return tenant;
      return null;
    }

    const hostNoPort = this.normalizeHost(opts.host ?? '');
    if (!hostNoPort) return null;

    /* 
    custom domain lookup

    const custom = await this.prisma.customDomain.findUnique({
      where: { hostname: hostNoPort},
      select: { tenant: { select: { id: true, slug: true, name: true}}},
      });

      if(custom?.tenant) return custom.tenant;
    */

    // Subdomain: <tenant>.<BASE_DOMAIN>
    const sub = this.subdomainFromHost(hostNoPort);
    if (sub) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: sub },
        select: { id: true, slug: true, name: true },
      });
      if (tenant) return tenant;
    }

    //Dev-only fallback
    if (process.env.NODE_ENV !== 'production') {
      const fallback = process.env.DEFAULT_TENANT_SLUG;
      if (fallback) {
        return this.prisma.tenant.findUnique({
          where: { slug: fallback },
          select: { id: true, slug: true, name: true },
        });
      }
    }
    return null;
  }
}
