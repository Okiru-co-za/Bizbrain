import { getServerSession } from 'next-auth/next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { prisma } from './prisma'

export async function getCurrentUser(req: any, res: any) {
  const session = (await getServerSession(req, res, authOptions as any)) as any
  const userId = session?.user?.id
  if (!userId) return null
  const user = await prisma.user.findUnique({ where: { id: userId } })
  return user
}

export function requireRole(user: any, roles: string[] = []) {
  if (!user) return false
  return roles.includes(user.role)
}
