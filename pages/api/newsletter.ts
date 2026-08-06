import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body as { email?: string }
  const normalized = (email || '').trim().toLowerCase()

  if (!EMAIL_RE.test(normalized)) {
    return res.status(400).json({ error: 'Enter a valid email address' })
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: normalized },
    update: {},
    create: { email: normalized, source: 'marketing_site' }
  })

  return res.status(200).json({ ok: true })
}
