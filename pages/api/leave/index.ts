import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/authServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { name: true, email: true } } }
    })
    return res.status(200).json({ leaveRequests })
  }

  if (req.method === 'POST') {
    const { userId, type, startDate, endDate, reason } = req.body as {
      userId?: string
      type?: 'ANNUAL' | 'SICK' | 'UNPAID' | 'OTHER'
      startDate?: string
      endDate?: string
      reason?: string
    }

    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ error: 'userId, startDate and endDate are required' })
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        tenantId: user.tenantId,
        userId,
        type: type || 'ANNUAL',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason
      }
    })
    return res.status(201).json({ leaveRequest })
  }

  return res.status(405).end()
}
