import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
      tenants: Array<{
        id: string
        key: string
        role: string
      }>
    }
  }

  interface User {
    role: string
  }
}
