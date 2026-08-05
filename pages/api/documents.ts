import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { getCurrentUser } from '../../lib/authServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const documents = await prisma.document.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
  res.status(200).json({ documents })
}
