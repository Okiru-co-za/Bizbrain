import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getCurrentUser } from '../../../lib/authServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const { id } = req.query
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' })

  const leaveRequest = await prisma.leaveRequest.findFirst({ where: { id, tenantId: user.tenantId } })
  if (!leaveRequest) return res.status(404).json({ error: 'Not found' })

  if (req.method === 'PATCH') {
    const { status } = req.body as { status?: 'APPROVED' | 'REJECTED' }
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'status must be APPROVED or REJECTED' })
    }

    const updated = await prisma.leaveRequest.update({ where: { id }, data: { status } })
    return res.status(200).json({ leaveRequest: updated })
  }

  return res.status(405).end()
}
