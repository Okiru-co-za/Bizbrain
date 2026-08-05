import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/authServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const vendorSubscriptions = await prisma.vendorSubscription.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { nextRenewalAt: 'asc' }
    })
    return res.status(200).json({ vendorSubscriptions })
  }

  if (req.method === 'POST') {
    const { name, category, costCents, billingCycle, nextRenewalAt, notes } = req.body as {
      name?: string
      category?: string
      costCents?: number
      billingCycle?: 'WEEKLY' | 'MONTHLY' | 'ANNUAL' | 'ONCE_OFF'
      nextRenewalAt?: string
      notes?: string
    }

    if (!name || costCents === undefined) {
      return res.status(400).json({ error: 'name and costCents are required' })
    }

    const vendorSubscription = await prisma.vendorSubscription.create({
      data: {
        tenantId: user.tenantId,
        name,
        category: category || null,
        costCents,
        billingCycle: billingCycle || 'MONTHLY',
        nextRenewalAt: nextRenewalAt ? new Date(nextRenewalAt) : null,
        notes: notes || null
      }
    })
    return res.status(201).json({ vendorSubscription })
  }

  return res.status(405).end()
}
