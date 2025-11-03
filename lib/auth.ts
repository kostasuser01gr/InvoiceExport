import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

const allowlistedEmail = process.env.ALLOWLISTED_STAFF_EMAIL || 'heraklion.airport@europcargreece.com'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // Check if user is allowlisted for staff access
        const isAllowlisted = user.email?.toLowerCase() === allowlistedEmail.toLowerCase()
        
        if (isAllowlisted) {
          // Get user's tenant roles
          const userTenants = await prisma.userTenant.findMany({
            where: { userId: user.id },
            include: { tenant: true },
          })
          
          session.user.role = 'STAFF'
          session.user.tenants = userTenants.map(ut => ({
            id: ut.tenantId,
            key: ut.tenant.key,
            role: ut.role,
          }))
        } else {
          session.user.role = 'USER'
          session.user.tenants = []
        }
      }
      return session
    },
    async signIn({ user }) {
      // Allow all sign-ins, but RBAC will be enforced at route level
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
}
