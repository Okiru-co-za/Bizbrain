import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../lib/prisma'

const authOptions = {
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Email (development)',
      credentials: {
        email: { label: 'Email', type: 'text' }
      },
      async authorize(credentials) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Passwordless email sign-in is disabled in production')
        }
        if (!credentials?.email) return null
        const email = credentials.email.toLowerCase()
        // Find or create a user tied to the seeded BizBrain tenant
        const tenant = await prisma.tenant.findFirst({ where: { name: 'BizBrain (SA) Ltd' } })
        if (!tenant) throw new Error('Seed tenant not found')

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

        // NextAuth expects an object with an `id` property
        return { id: user.id, email: user.email, name: user.name }
      }
    })
  ],
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      // Attach tenantId and role from DB user record
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
      if (dbUser) {
        session.user.id = dbUser.id
        session.user.tenantId = dbUser.tenantId
        session.user.role = dbUser.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin'
  }
}

export default NextAuth(authOptions as any)
export { authOptions }
