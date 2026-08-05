import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { getCurrentUser } from '../../lib/authServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const tenantId = user.tenantId

  const [customerCount, leadsByStatus, openOpportunities, quotesByStatus] = await Promise.all([
    prisma.customer.count({ where: { tenantId } }),
    prisma.lead.groupBy({ by: ['status'], where: { tenantId }, _count: { _all: true } }),
    prisma.opportunity.aggregate({
      where: { tenantId },
      _count: { _all: true },
      _sum: { amountCents: true }
    }),
    prisma.quote.groupBy({ by: ['status'], where: { tenantId }, _count: { _all: true } })
  ])

  res.status(200).json({
    customerCount,
    leadsByStatus: leadsByStatus.map((row) => ({ status: row.status, count: row._count._all })),
    opportunities: {
      count: openOpportunities._count._all,
      pipelineValueCents: openOpportunities._sum.amountCents || 0
    },
    quotesByStatus: quotesByStatus.map((row) => ({ status: row.status, count: row._count._all }))
  })
}
