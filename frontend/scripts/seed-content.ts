/**
 * Content Seeding Script
 *
 * Seeds the database with sample content for testing the paywall system
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-content.ts
 *
 * Or add to package.json scripts:
 *   "seed": "ts-node --compiler-options '{\"module\":\"commonjs\"}' scripts/seed-content.ts"
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
    description:
      'Learn the basics of WKND_CO and how to make the most of your account.',
    content: `Welcome to WKND_CO! This guide will help you get started with our platform and understand all the amazing features available to you.

## What is WKND_CO?

WKND_CO is a premium content platform designed to help you access high-quality articles, tutorials, and resources. Whether you're on the free plan or a premium subscriber, we have content tailored for your needs.

## Setting Up Your Account

Creating an account is simple. Just sign up with your email and password, and you'll immediately get a 14-day premium trial to explore all our features.

## Exploring Content

Browse our content library to find articles on various topics. Each article is marked with its tier level (Free, Premium, or Enterprise) so you know what's accessible with your current plan.

## Upgrading Your Plan

When you're ready to unlock more content, visit our pricing page to choose the plan that's right for you. Upgrading is instant and gives you immediate access to all premium features.

Enjoy your journey with WKND_CO!`,
    required_tier: 'free',
    is_published: true,
  },
  {
    title: 'Understanding User Roles and Permissions',
    slug: 'user-roles-permissions',
    description:
      'A comprehensive guide to how user roles work in modern applications.',
    content: `User roles and permissions are fundamental to application security. In this article, we'll explore how they work and why they matter.

## The Role Hierarchy

Most applications use a tiered role system:
- Basic users have access to core features
- Premium users unlock advanced functionality
- Enterprise users get everything plus custom features

## Why This Matters

Proper role management ensures users only access features they've paid for, while also providing a clear upgrade path for those who want more.

## Best Practices

Always validate permissions on the server side, never trust client-side checks alone. Use row-level security in your database to add an extra layer of protection.

## Implementation Tips

Start with a simple role system and expand as needed. It's easier to add complexity later than to simplify an overly complex system.`,
    required_tier: 'free',
    is_published: true,
  },
  {
    title: 'Building Your First API',
    slug: 'building-first-api',
    description:
      'Step-by-step guide to creating a RESTful API from scratch.',
    content: `APIs are the backbone of modern applications. Let's build one together.

## Planning Your API

Before writing code, plan your endpoints, data models, and authentication strategy. Good planning saves hours of refactoring later.

## Setting Up

Choose your framework (Express, Fastify, etc.) and set up your project structure. Keep it organized from day one.

## Your First Endpoint

Start simple with a GET endpoint that returns JSON data. Test it thoroughly before moving on.

## Authentication

Add authentication to protect your endpoints. JWT tokens are a popular choice for stateless authentication.

## Next Steps

Once you have the basics working, add error handling, validation, and documentation. Your future self will thank you!`,
    required_tier: 'free',
    is_published: true,
  },

  // Premium content
  {
    title: 'Advanced Authentication Patterns',
    slug: 'advanced-authentication',
    description:
      'Deep dive into modern authentication techniques including OAuth, JWT, and session management.',
    content: `Modern authentication is complex but crucial. This guide covers advanced patterns used by production applications.

## OAuth 2.0 Flow

OAuth allows users to authenticate using third-party providers like Google or GitHub. We'll implement the authorization code flow, the most secure OAuth pattern.

## JWT Best Practices

JSON Web Tokens are powerful but can be misused. Learn about token rotation, refresh tokens, and secure storage strategies.

## Session Management

Server-side sessions vs stateless tokens - when to use each approach. We'll implement both and compare their security characteristics.

## Multi-Factor Authentication

Adding MFA significantly improves security. We'll implement TOTP (Time-based One-Time Passwords) using industry-standard libraries.

## Password Security

Proper password hashing with bcrypt or Argon2. Never store passwords in plain text, and understand the importance of salt and work factors.

## Rate Limiting

Protect your authentication endpoints from brute force attacks with intelligent rate limiting strategies.

## Zero-Trust Security

Implement the principle of least privilege and verify every request, even from authenticated users.

This comprehensive approach to authentication will keep your users safe and your application secure.`,
    required_tier: 'premium',
    is_published: true,
  },
  {
    title: 'Database Performance Optimization',
    slug: 'database-performance',
    description:
      'Learn how to optimize database queries and improve application performance.',
    content: `Database performance can make or break your application. Let's optimize it.

## Understanding Query Performance

Start with EXPLAIN to understand how your database executes queries. Identify slow queries and bottlenecks.

## Indexing Strategies

Indexes speed up reads but slow down writes. Learn when and where to add indexes for maximum impact.

## Query Optimization

Rewrite inefficient queries, avoid N+1 problems, and use joins effectively. Small changes can yield massive performance improvements.

## Connection Pooling

Database connections are expensive. Pool them for better resource utilization and faster response times.

## Caching Strategies

Cache frequently accessed data to reduce database load. Use Redis or in-memory caches strategically.

## Monitoring and Maintenance

Set up monitoring to catch performance issues before they affect users. Regular maintenance keeps your database healthy.

## Scaling Considerations

When vertical scaling isn't enough, consider read replicas, sharding, or switching to a distributed database.

Master these techniques to build applications that scale effortlessly.`,
    required_tier: 'premium',
    is_published: true,
  },
  {
    title: 'Building Real-Time Applications',
    slug: 'real-time-applications',
    description:
      'Create real-time features using WebSockets, Server-Sent Events, and more.',
    content: `Real-time features make applications feel alive. Let's build them.

## WebSocket Basics

WebSockets enable bidirectional communication between client and server. Perfect for chat, notifications, and live updates.

## Server-Sent Events

SSE is simpler than WebSockets for one-way communication from server to client. Great for live feeds and notifications.

## Implementation Patterns

Learn about pub/sub patterns, room-based messaging, and presence systems for tracking online users.

## Scaling Real-Time

Real-time systems require special scaling considerations. Redis pub/sub and sticky sessions help maintain connections.

## Error Handling

Network issues are inevitable. Implement reconnection logic and graceful degradation.

## Security

Authenticate WebSocket connections and validate all messages. Real-time doesn't mean unsecured.

## Testing

Test reconnection scenarios, message ordering, and concurrent connections to ensure reliability.

Build real-time features that users love and that scale to millions of connections.`,
    required_tier: 'premium',
    is_published: true,
  },

  // Enterprise content
  {
    title: 'Microservices Architecture at Scale',
    slug: 'microservices-architecture',
    description:
      'Comprehensive guide to designing, implementing, and managing microservices in production.',
    content: `Microservices offer flexibility and scalability but introduce complexity. This guide helps you navigate that complexity.

## Service Design Principles

Learn to identify service boundaries, design APIs, and manage dependencies. Good service design prevents future headaches.

## Inter-Service Communication

Choose between REST, gRPC, and message queues. Each has trade-offs for different use cases.

## Data Management

Each service should own its data. Learn about the Saga pattern, event sourcing, and eventual consistency.

## Service Discovery

Services need to find each other. Implement service discovery with Consul, etcd, or Kubernetes DNS.

## API Gateway

Centralize authentication, rate limiting, and routing with an API gateway. Kong and Traefik are popular choices.

## Observability

Distributed tracing with Jaeger or Zipkin helps debug issues across services. Centralized logging with ELK stack.

## Deployment Strategies

Blue-green deployments, canary releases, and feature flags enable safe production updates.

## Testing Microservices

Unit tests, integration tests, contract tests, and end-to-end tests - build a comprehensive testing pyramid.

## Circuit Breakers

Prevent cascading failures with circuit breakers. Implement them using libraries like Hystrix or Resilience4j.

## Security

Service-to-service authentication, API keys, mutual TLS, and zero-trust networks protect your services.

Master microservices to build systems that scale to enterprise needs.`,
    required_tier: 'enterprise',
    is_published: true,
  },
  {
    title: 'Enterprise-Grade CI/CD Pipelines',
    slug: 'enterprise-cicd',
    description:
      'Build robust continuous integration and deployment pipelines for large-scale applications.',
    content: `CI/CD is essential for modern software delivery. Enterprise pipelines require additional considerations for security, compliance, and scale.

## Pipeline Architecture

Design pipelines that handle monorepos, microservices, and complex dependencies. Parallel execution and caching optimize build times.

## Security Scanning

Integrate SAST, DAST, and dependency scanning into your pipeline. Catch vulnerabilities before they reach production.

## Compliance and Auditing

Meet regulatory requirements with audit logs, approval gates, and automated compliance checks.

## Deployment Strategies

Implement sophisticated deployment patterns: blue-green, canary, progressive delivery with automatic rollback.

## Infrastructure as Code

Terraform, Pulumi, or CloudFormation enable reproducible infrastructure. Version control everything.

## Monitoring and Alerts

Integrate monitoring with deployments. Automatically roll back if metrics indicate problems.

## Multi-Environment Management

Dev, staging, and production environments with different configurations. Use environment-specific secrets management.

## Performance Optimization

Cache dependencies, use incremental builds, and parallelize tasks. Enterprise pipelines should be fast.

## Disaster Recovery

Backup strategies, runbooks for common issues, and tested recovery procedures prevent prolonged outages.

## Cost Optimization

Pipeline costs add up at scale. Optimize resource usage and use spot instances where appropriate.

Build CI/CD pipelines that deliver software safely, quickly, and reliably at enterprise scale.`,
    required_tier: 'enterprise',
    is_published: true,
  },
]

async function seedContent() {
  console.log('🌱 Starting content seeding...\n')

  try {
    // Check if content already exists
    const { data: existingContent, error: checkError } = await supabase
      .from('content')
      .select('slug')

    if (checkError) {
      throw new Error(`Error checking existing content: ${checkError.message}`)
    }

    const existingSlugs = new Set(existingContent?.map((c) => c.slug) || [])

    // Filter out content that already exists
    const newContent = sampleContent.filter((c) => !existingSlugs.has(c.slug))

    if (newContent.length === 0) {
      console.log('✨ All content already exists! No new content to seed.')
      return
    }

    console.log(`📝 Seeding ${newContent.length} new articles...\n`)

    // Insert content
    const { data, error } = await supabase
      .from('content')
      .insert(newContent)
      .select()

    if (error) {
      throw new Error(`Error inserting content: ${error.message}`)
    }

    console.log('✅ Successfully seeded content!\n')
    console.log('📊 Summary:')
    console.log(`   - Total articles: ${data?.length || 0}`)
    console.log(
      `   - Free: ${newContent.filter((c) => c.required_tier === 'free').length}`
    )
    console.log(
      `   - Premium: ${newContent.filter((c) => c.required_tier === 'premium').length}`
    )
    console.log(
      `   - Enterprise: ${newContent.filter((c) => c.required_tier === 'enterprise').length}`
    )
    console.log('\n💡 Visit /content to see your new articles!')
  } catch (error) {
    console.error('❌ Error seeding content:', error)
    process.exit(1)
  }
}

// Run the seed function
seedContent()
