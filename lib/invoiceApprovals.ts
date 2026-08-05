import { prisma } from './prisma'

const APPROVAL_THRESHOLD_CENTS = 5_000_000 // R50,000

export async function flagInvoiceForApprovalIfNeeded(
  tenantId: string,
  invoice: { id: string; totalCents: number; customerId: string | null },
  requestedById: string
) {
  const customer = invoice.customerId
    ? await prisma.customer.findUnique({ where: { id: invoice.customerId } })
    : null

  const overThreshold = invoice.totalCents > APPROVAL_THRESHOLD_CENTS
  const missingCustomerInfo = !invoice.customerId || !customer?.email

  if (!overThreshold && !missingCustomerInfo) return

  await prisma.approval.create({
    data: {
      tenantId,
      requestedById,
      action: overThreshold ? 'invoice_over_threshold' : 'invoice_missing_customer_info',
      reason: overThreshold
        ? `Invoice total exceeds R${(APPROVAL_THRESHOLD_CENTS / 100).toLocaleString('en-ZA')}`
        : 'Invoice has no customer or the customer has no email on file',
      riskLevel: overThreshold ? 'HIGH' : 'MEDIUM',
      entity: 'Invoice',
      entityId: invoice.id
    }
  })
}
