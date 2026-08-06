import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/authServer'
import { parseVendorEmail } from '../../../lib/vendorEmailParsing'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })
  if (req.method !== 'POST') return res.status(405).end()

  const inboxItems = await prisma.inboxItem.findMany({
    where: { tenantId: user.tenantId, source: 'email', status: { not: 'RESOLVED' } },
    take: 200
  })

  const created: string[] = []
  const updated: string[] = []

  for (const item of inboxItems) {
    const parsed = parseVendorEmail(item)
    if (!parsed) continue

    const existing = await prisma.vendorSubscription.findFirst({
      where: { tenantId: user.tenantId, name: parsed.name }
    })

    if (existing) {
      await prisma.vendorSubscription.update({
        where: { id: existing.id },
        data: {
          costCents: parsed.costCents,
          currency: parsed.currency,
          billingCycle: parsed.billingCycle,
          nextRenewalAt: parsed.nextRenewalAt ?? existing.nextRenewalAt,
          notes: `Updated from inbox email: "${item.subject || item.sender}"`
        }
      })
      updated.push(parsed.name)
    } else {
      await prisma.vendorSubscription.create({
        data: {
          tenantId: user.tenantId,
          name: parsed.name,
          category: parsed.category,
          costCents: parsed.costCents,
          currency: parsed.currency,
          billingCycle: parsed.billingCycle,
          nextRenewalAt: parsed.nextRenewalAt,
          status: 'ACTIVE',
          notes: `Detected from inbox email: "${item.subject || item.sender}"`
        }
      })
      created.push(parsed.name)
    }

    await prisma.inboxItem.update({ where: { id: item.id }, data: { status: 'RESOLVED' } })
  }

  return res.status(200).json({ scanned: inboxItems.length, created, updated })
}
