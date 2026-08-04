import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const customers = await prisma.customer.findMany({ take: 50 })
  res.status(200).json({ customers })
}
