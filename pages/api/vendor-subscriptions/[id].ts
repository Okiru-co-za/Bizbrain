import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/authServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { id } = req.query
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' })

  const vendorSubscription = await prisma.vendorSubscription.findFirst({
    where: { id, tenantId: user.tenantId }
  })
  if (!vendorSubscription) return res.status(404).json({ error: 'Not found' })

  if (req.method === 'PATCH') {
    const { status } = req.body as { status?: 'ACTIVE' | 'TRIAL' | 'CANCELLED' }
    if (!status || !['ACTIVE', 'TRIAL', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'status must be ACTIVE, TRIAL or CANCELLED' })
    }

    const updated = await prisma.vendorSubscription.update({ where: { id }, data: { status } })
    return res.status(200).json({ vendorSubscription: updated })
  }

  return res.status(405).end()
}
