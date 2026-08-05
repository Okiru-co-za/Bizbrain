import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/authServer'
import { flagInvoiceForApprovalIfNeeded } from '../../../lib/invoiceApprovals'

type InvoiceItemInput = {
  productId?: string
  description?: string
  quantity?: number
  unitPriceCents: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const invoices = await prisma.invoice.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        customer: { select: { name: true, businessName: true, email: true } },
        items: true
      }
    })
    return res.status(200).json({ invoices })
  }

  if (req.method === 'POST') {
    const { customerId, dueDate, items } = req.body as {
      customerId?: string
      dueDate?: string
      items?: InvoiceItemInput[]
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'At least one line item is required' })
    }

    const totalCents = items.reduce(
      (sum, item) => sum + item.unitPriceCents * (item.quantity ?? 1),
      0
    )

    const existingCount = await prisma.invoice.count({ where: { tenantId: user.tenantId } })
    const invoiceNumber = `INV-${String(existingCount + 1).padStart(4, '0')}`

    const invoice = await prisma.invoice.create({
      data: {
        tenantId: user.tenantId,
        customerId: customerId || null,
        invoiceNumber,
        totalCents,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: user.id,
        items: {
          create: items.map((item) => ({
            productId: item.productId || null,
            description: item.description,
            quantity: item.quantity ?? 1,
            unitPriceCents: item.unitPriceCents
          }))
        }
      },
      include: { items: true }
    })

    await flagInvoiceForApprovalIfNeeded(
      user.tenantId,
      { id: invoice.id, totalCents: invoice.totalCents, customerId: invoice.customerId },
      user.id
    )

    return res.status(201).json({ invoice })
  }

  return res.status(405).end()
}
