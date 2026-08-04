import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Missing email' })

  // Development-only: find or create a user in the BizBrain tenant
  const tenant = await prisma.tenant.findFirst({ where: { name: 'BizBrain (SA) Ltd' } })
  if (!tenant) return res.status(500).json({ error: 'Seed tenant not found' })

  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email,
        name: email.split('@')[0],
        role: 'STAFF'
      }
    })
  }

  // Also return a NextAuth-compatible response shape
  res.status(200).json({ user })
}
