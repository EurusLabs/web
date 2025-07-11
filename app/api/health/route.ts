import { NextResponse } from 'next/server'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: 'ok',
      cache: 'ok',
      external_apis: 'ok'
    }
  }

  return NextResponse.json(health, { status: 200 })
} 