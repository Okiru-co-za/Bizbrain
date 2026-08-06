type InboxLike = { sender?: string | null; subject?: string | null; message?: string | null }

type BillingCycle = 'WEEKLY' | 'MONTHLY' | 'ANNUAL' | 'ONCE_OFF'

export type ParsedVendorSubscription = {
  name: string
  category: string
  costCents: number
  currency: string
  billingCycle: BillingCycle
  nextRenewalAt: Date | null
}

// Known vendor sender domains we recognise as bills for services the
// tenant itself pays for (as opposed to emails from their own customers).
// Extend this list as new vendors are added.
const VENDOR_RULES: Array<{ domain: RegExp; name: string; category: string }> = [
  { domain: /amazonaws\.com|aws\.amazon\.com/i, name: 'AWS', category: 'Cloud Hosting' },
  { domain: /openai\.com/i, name: 'OpenAI', category: 'AI / LLM' },
  { domain: /anthropic\.com/i, name: 'Anthropic', category: 'AI / LLM' },
  { domain: /figma\.com/i, name: 'Figma', category: 'Software' },
  { domain: /cloud\.google\.com|google\.com/i, name: 'Google Cloud', category: 'Cloud Hosting' },
  { domain: /azure\.com|microsoft\.com/i, name: 'Microsoft Azure', category: 'Cloud Hosting' },
  { domain: /vercel\.com/i, name: 'Vercel', category: 'Web Hosting' },
  { domain: /godaddy\.com|namecheap\.com/i, name: 'Domain registrar', category: 'Domain' }
]

// Only matches emails from a known vendor domain that also contain a
// parseable amount - deliberately conservative to avoid mistaking a
// customer's invoice question for a vendor bill.
export function parseVendorEmail(item: InboxLike): ParsedVendorSubscription | null {
  const sender = item.sender || ''
  const text = `${item.subject || ''} ${item.message || ''}`

  const vendor = VENDOR_RULES.find((rule) => rule.domain.test(sender))
  if (!vendor) return null

  const usdMatch = text.match(/\$\s?(\d[\d,]*(?:\.\d{1,2})?)/)
  const zarMatch = text.match(/(?<![A-Za-z])R\s?(\d[\d,]*(?:\.\d{1,2})?)/)
  const amountMatch = usdMatch || zarMatch
  if (!amountMatch) return null

  const amount = parseFloat(amountMatch[1].replace(/,/g, ''))
  const currency = usdMatch ? 'USD' : 'ZAR'

  let billingCycle: BillingCycle = 'MONTHLY'
  if (/annual|yearly|per year/i.test(text)) billingCycle = 'ANNUAL'
  else if (/weekly|per week/i.test(text)) billingCycle = 'WEEKLY'
  else if (/once.?off|one.?time/i.test(text)) billingCycle = 'ONCE_OFF'

  const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/)
  const nextRenewalAt = dateMatch ? new Date(dateMatch[1]) : null

  return {
    name: vendor.name,
    category: vendor.category,
    costCents: Math.round(amount * 100),
    currency,
    billingCycle,
    nextRenewalAt
  }
}
