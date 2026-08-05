import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/authServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { id } = req.query
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' })

  const invoice = await prisma.invoice.findFirst({ where: { id, tenantId: user.tenantId } })
  if (!invoice) return res.status(404).json({ error: 'Not found' })

  if (req.method === 'PATCH') {
    const { status } = req.body as { status?: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' }
    if (!status) return res.status(400).json({ error: 'status is required' })

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status,
        issuedAt: status === 'SENT' ? new Date() : invoice.issuedAt,
        paidAt: status === 'PAID' ? new Date() : invoice.paidAt
      }
    })
    return res.status(200).json({ invoice: updated })
  }

  return res.status(405).end()
}
