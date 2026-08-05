import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { getCurrentUser } from '../../lib/authServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId },
    include: { subscription: true }
  })

  res.status(200).json({
    tenant: tenant && { name: tenant.name, domain: tenant.domain },
    subscription: tenant?.subscription || null,
    user: { name: user.name, email: user.email, role: user.role }
  })
}
