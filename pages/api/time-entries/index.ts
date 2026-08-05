import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/authServer'

function toDayStart(dateStr: string) {
  const d = new Date(dateStr)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const timeEntries = await prisma.timeEntry.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { date: 'desc' },
      take: 50,
      include: { user: { select: { name: true, email: true } } }
    })
    return res.status(200).json({ timeEntries })
  }

  if (req.method === 'POST') {
    const { userId, date, hoursWorked, notes } = req.body as {
      userId?: string
      date?: string
      hoursWorked?: number
      notes?: string
    }

    if (!userId || !date || hoursWorked === undefined) {
      return res.status(400).json({ error: 'userId, date and hoursWorked are required' })
    }

    const day = toDayStart(date)
    const timeEntry = await prisma.timeEntry.upsert({
      where: { userId_date: { userId, date: day } },
      update: { hoursWorked, notes },
      create: { tenantId: user.tenantId, userId, date: day, hoursWorked, notes }
    })
    return res.status(201).json({ timeEntry })
  }

  return res.status(405).end()
}
