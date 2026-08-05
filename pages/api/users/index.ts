import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/authServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const users = await prisma.user.findMany({
    where: { tenantId: user.tenantId, isActive: true },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' }
  })
  res.status(200).json({ users })
}
