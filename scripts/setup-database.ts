#!/usr/bin/env ts-node

/**
 * Automatic Database Setup Script
 *
 * This script automatically sets up the entire database schema and seeds content.
 * Run with: npm run setup
 *
 * Requirements:
 * - NEXT_PUBLIC_SUPABASE_URL in .env.local
 * - SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\n💡 Add these to your .env.local file')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Execute SQL by reading from migration file
 */
async function executeMigration() {
  console.log('📖 Reading migration file...')

  const migrationPath = path.resolve(__dirname, '../migrations/001_user_roles_and_content.sql')

  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found: ${migrationPath}`)
  }

  const sql = fs.readFileSync(migrationPath, 'utf-8')

  console.log('🔧 Executing migration...')
  console.log('   This will create:')
  console.log('   - profiles table')
  console.log('   - content table')
  console.log('   - RLS policies')
  console.log('   - Triggers and functions')

  // Note: Supabase JS client doesn't support raw SQL execution directly
  // We need to use the SQL endpoint via fetch
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    },
    body: JSON.stringify({ query: sql })
  })

  if (!response.ok) {
    // If the RPC doesn't exist, we need to guide the user to run it manually
    console.log('⚠️  Unable to execute SQL automatically via API')
    console.log('')
    console.log('📋 MANUAL STEP REQUIRED:')
    console.log('   1. Go to Supabase Dashboard → SQL Editor')
    console.log('   2. Open: migrations/001_user_roles_and_content.sql')
    console.log('   3. Copy and paste the entire file')
    console.log('   4. Click "Run"')
    console.log('')
    console.log('   Once done, run this script again to seed content.')
    console.log('')
    return false
  }

  console.log('✅ Migration executed successfully')
  return true
}

/**
 * Check if tables exist
 */
async function checkTablesExist() {
  console.log('🔍 Checking if tables exist...')

  try {
    // Check profiles table
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (profilesError && profilesError.code === '42P01') {
      console.log('❌ profiles table does not exist')
      return false
    }

    // Check content table
    const { error: contentError } = await supabase
      .from('content')
      .select('id')
      .limit(1)

    if (contentError && contentError.code === '42P01') {
      console.log('❌ content table does not exist')
      return false
    }

    console.log('✅ Tables exist')
    return true
  } catch (error) {
    console.error('❌ Error checking tables:', error)
    return false
  }
}

/**
 * Seed sample content
 */
async function seedContent() {
  console.log('🌱 Seeding sample content...')

  interface ContentItem {
    title: string
    slug: string
    description: string
    content: string
    required_tier: 'free' | 'premium' | 'enterprise'
    is_published: boolean
  }

  const sampleContent: ContentItem[] = [
    // Free content
    {
      title: 'Getting Started with WKND_CO',
      slug: 'getting-started',
      description: 'Learn the basics of WKND_CO and how to make the most of your account.',
      content: `Welcome to WKND_CO! This guide will help you get started with our platform.

## What is WKND_CO?

WKND_CO is a premium content platform designed to help you access high-quality articles, tutorials, and resources.

## Setting Up Your Account

Creating an account is simple. Just sign up with your email and password, and you'll immediately get a 14-day premium trial.

## Exploring Content

Browse our content library to find articles on various topics. Each article is marked with its tier level.`,
      required_tier: 'free',
      is_published: true,
    },
    {
      title: 'Understanding User Roles and Permissions',
      slug: 'user-roles-permissions',
      description: 'A comprehensive guide to how user roles work in modern applications.',
      content: `User roles and permissions are fundamental to application security.

## The Role Hierarchy

Most applications use a tiered role system for access control.

## Why This Matters

Proper role management ensures users only access features they've paid for.`,
      required_tier: 'free',
      is_published: true,
    },
    {
      title: 'Building Your First API',
      slug: 'building-first-api',
      description: 'Step-by-step guide to creating a RESTful API from scratch.',
      content: `APIs are the backbone of modern applications. Let's build one together.

## Planning Your API

Before writing code, plan your endpoints and data models.

## Your First Endpoint

Start simple with a GET endpoint that returns JSON data.`,
      required_tier: 'free',
      is_published: true,
    },

    // Premium content
    {
      title: 'Advanced Authentication Patterns',
      slug: 'advanced-authentication',
      description: 'Deep dive into modern authentication techniques including OAuth, JWT, and session management.',
      content: `Modern authentication is complex but crucial. This guide covers advanced patterns.

## OAuth 2.0 Flow

OAuth allows users to authenticate using third-party providers.

## JWT Best Practices

JSON Web Tokens are powerful but can be misused. Learn proper usage.

## Multi-Factor Authentication

Adding MFA significantly improves security.`,
      required_tier: 'premium',
      is_published: true,
    },
    {
      title: 'Database Performance Optimization',
      slug: 'database-performance',
      description: 'Learn how to optimize database queries and improve application performance.',
      content: `Database performance can make or break your application.

## Understanding Query Performance

Use EXPLAIN to understand how your database executes queries.

## Indexing Strategies

Indexes speed up reads but slow down writes.

## Connection Pooling

Database connections are expensive. Pool them for better performance.`,
      required_tier: 'premium',
      is_published: true,
    },
    {
      title: 'Building Real-Time Applications',
      slug: 'real-time-applications',
      description: 'Create real-time features using WebSockets, Server-Sent Events, and more.',
      content: `Real-time features make applications feel alive.

## WebSocket Basics

WebSockets enable bidirectional communication.

## Server-Sent Events

SSE is simpler than WebSockets for one-way communication.

## Scaling Real-Time

Real-time systems require special scaling considerations.`,
      required_tier: 'premium',
      is_published: true,
    },

    // Enterprise content
    {
      title: 'Microservices Architecture at Scale',
      slug: 'microservices-architecture',
      description: 'Comprehensive guide to designing, implementing, and managing microservices in production.',
      content: `Microservices offer flexibility and scalability but introduce complexity.

## Service Design Principles

Learn to identify service boundaries and manage dependencies.

## Inter-Service Communication

Choose between REST, gRPC, and message queues.

## Observability

Distributed tracing helps debug issues across services.`,
      required_tier: 'enterprise',
      is_published: true,
    },
    {
      title: 'Enterprise-Grade CI/CD Pipelines',
      slug: 'enterprise-cicd',
      description: 'Build robust continuous integration and deployment pipelines for large-scale applications.',
      content: `CI/CD is essential for modern software delivery.

## Pipeline Architecture

Design pipelines that handle monorepos and microservices.

## Security Scanning

Integrate SAST, DAST, and dependency scanning.

## Deployment Strategies

Implement blue-green deployments and canary releases.`,
      required_tier: 'enterprise',
      is_published: true,
    },
  ]

  // Check if content already exists
  const { data: existingContent } = await supabase
    .from('content')
    .select('slug')

  const existingSlugs = new Set(existingContent?.map((c) => c.slug) || [])
  const newContent = sampleContent.filter((c) => !existingSlugs.has(c.slug))

  if (newContent.length === 0) {
    console.log('✨ All content already exists!')
    return true
  }

  console.log(`📝 Inserting ${newContent.length} new articles...`)

  const { error } = await supabase
    .from('content')
    .insert(newContent)

  if (error) {
    console.error('❌ Error seeding content:', error.message)
    return false
  }

  console.log('✅ Content seeded successfully')
  console.log(`   - Free articles: ${newContent.filter(c => c.required_tier === 'free').length}`)
  console.log(`   - Premium articles: ${newContent.filter(c => c.required_tier === 'premium').length}`)
  console.log(`   - Enterprise articles: ${newContent.filter(c => c.required_tier === 'enterprise').length}`)

  return true
}

/**
 * Verify setup
 */
async function verifySetup() {
  console.log('🔍 Verifying database setup...')

  // Check profiles table structure
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)

  if (profilesError) {
    console.log('❌ profiles table verification failed:', profilesError.message)
    return false
  }

  // Check content table structure
  const { data: content, error: contentError } = await supabase
    .from('content')
    .select('*')
    .limit(1)

  if (contentError) {
    console.log('❌ content table verification failed:', contentError.message)
    return false
  }

  // Count content
  const { count } = await supabase
    .from('content')
    .select('*', { count: 'exact', head: true })

  console.log('✅ Database verification passed')
  console.log(`   - profiles table: Ready`)
  console.log(`   - content table: Ready (${count} articles)`)

  return true
}

/**
 * Main setup function
 */
async function setup() {
  console.log('🚀 Starting automatic database setup...\n')

  try {
    // Check if tables already exist
    const tablesExist = await checkTablesExist()

    if (!tablesExist) {
      console.log('\n📋 DATABASE MIGRATION REQUIRED\n')
      console.log('╔════════════════════════════════════════════════════════╗')
      console.log('║  Please run the migration in Supabase SQL Editor:     ║')
      console.log('╚════════════════════════════════════════════════════════╝\n')
      console.log('Steps:')
      console.log('1. Go to: https://supabase.com/dashboard')
      console.log('2. Select your project')
      console.log('3. Click "SQL Editor" in left sidebar')
      console.log('4. Click "New Query"')
      console.log('5. Copy the entire file: migrations/001_user_roles_and_content.sql')
      console.log('6. Paste into SQL Editor')
      console.log('7. Click "Run" or press Ctrl+Enter')
      console.log('8. Wait for success message')
      console.log('9. Run this script again: npm run setup\n')

      console.log('💡 The migration file is located at:')
      console.log(`   ${path.resolve(__dirname, '../migrations/001_user_roles_and_content.sql')}\n`)

      process.exit(0)
    }

    // Tables exist, proceed with seeding
    console.log('✅ Database schema is set up\n')

    // Seed content
    const seedSuccess = await seedContent()
    if (!seedSuccess) {
      throw new Error('Content seeding failed')
    }

    console.log('')

    // Verify everything
    const verifySuccess = await verifySetup()
    if (!verifySuccess) {
      throw new Error('Verification failed')
    }

    console.log('\n🎉 DATABASE SETUP COMPLETE!\n')
    console.log('Next steps:')
    console.log('1. Run: npm run dev')
    console.log('2. Visit: http://localhost:3000')
    console.log('3. Sign up to test the 14-day trial')
    console.log('4. Browse /content to see the paywall in action')
    console.log('5. Visit /pricing to see subscription tiers\n')

  } catch (error) {
    console.error('\n❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run setup
setup()
