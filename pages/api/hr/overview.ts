import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '../../../lib/authServer'
import { getHrOverview } from '../../../lib/hrOverview'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req, res)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const overview = await getHrOverview(user.tenantId)
  res.status(200).json({ overview })
}
