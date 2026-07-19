import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

declare global {
  var prisma: PrismaClient | undefined
}

const libsqlConfig = {
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
}

const adapter = new PrismaLibSql(libsqlConfig)

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
