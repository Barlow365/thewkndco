-- =====================================================
-- Seed Sample Content
-- =====================================================

-- Insert 8 sample articles with different tier requirements

INSERT INTO public.content (title, slug, description, content, required_tier, is_published)
VALUES
-- Free Articles (3)
(
  'Getting Started with WKND_CO',
  'getting-started',
  'Learn the basics of WKND_CO and how to make the most of your account.',
  'Welcome to WKND_CO! This guide will help you get started with our platform and understand all the amazing features available to you.

## What is WKND_CO?

WKND_CO is a premium content platform designed to help you access high-quality articles, tutorials, and resources. Whether you''re on the free plan or a premium subscriber, we have content tailored for your needs.

## Setting Up Your Account

Creating an account is simple. Just sign up with your email and password, and you''ll immediately get a 14-day premium trial to explore all our features.

## Exploring Content

Browse our content library to find articles on various topics. Each article is marked with its tier level (Free, Premium, or Enterprise) so you know what''s accessible with your current plan.

## Upgrading Your Plan

When you''re ready to unlock more content, visit our pricing page to choose the plan that''s right for you. Upgrading is instant and gives you immediate access to all premium features.

Enjoy your journey with WKND_CO!',
  'free',
  true
),
(
  'Understanding User Roles and Permissions',
  'user-roles-permissions',
  'A comprehensive guide to how user roles work in modern applications.',
  'User roles and permissions are fundamental to application security. In this article, we''ll explore how they work and why they matter.

## The Role Hierarchy

Most applications use a tiered role system:
- Basic users have access to core features
- Premium users unlock advanced functionality
- Enterprise users get everything plus custom features

## Why This Matters

Proper role management ensures users only access features they''ve paid for, while also providing a clear upgrade path for those who want more.

## Best Practices

Always validate permissions on the server side, never trust client-side checks alone. Use row-level security in your database to add an extra layer of protection.

## Implementation Tips

Start with a simple role system and expand as needed. It''s easier to add complexity later than to simplify an overly complex system.',
  'free',
  true
),
(
  'Building Your First API',
  'building-first-api',
  'Learn how to create a RESTful API from scratch using modern tools.',
  'APIs are the backbone of modern applications. In this guide, we''ll build a simple RESTful API that you can use as a foundation for your projects.

## What You''ll Need

- Basic understanding of JavaScript/TypeScript
- Node.js installed on your machine
- A code editor (VS Code recommended)

## Setting Up

First, initialize your project with npm and install the necessary dependencies. We''ll use Express.js for routing and middleware support.

## Creating Endpoints

Start with basic CRUD operations: Create, Read, Update, and Delete. Each endpoint should handle a specific resource and return appropriate HTTP status codes.

## Testing Your API

Use tools like Postman or curl to test your endpoints. Make sure to test edge cases and error handling as well as the happy path.

Ready to build something amazing? Let''s get started!',
  'free',
  true
),

-- Premium Articles (3)
(
  'Advanced Database Optimization Techniques',
  'database-optimization',
  'Master the art of database performance tuning and query optimization.',
  'Database performance can make or break your application. In this premium guide, we dive deep into optimization strategies that can dramatically improve your database speed.

## Indexing Strategies

Learn when and how to create indexes, composite indexes, and partial indexes. We''ll cover real-world scenarios where proper indexing reduced query times from seconds to milliseconds.

## Query Optimization

Understand how to read and interpret query execution plans. Learn to identify slow queries and rewrite them for optimal performance.

## Connection Pooling

Discover how connection pooling can dramatically improve your application''s scalability. We''ll show you how to configure connection pools for different workloads.

## Caching Layers

Implement intelligent caching strategies to reduce database load. Learn about Redis, Memcached, and application-level caching.

## Partitioning and Sharding

For massive datasets, partitioning and sharding are essential. We''ll explain when to use each technique and how to implement them effectively.

This is premium content that goes beyond the basics to give you production-grade database skills.',
  'premium',
  true
),
(
  'Microservices Architecture Deep Dive',
  'microservices-architecture',
  'Build scalable applications with microservices patterns and best practices.',
  'Microservices have revolutionized how we build large-scale applications. This comprehensive guide covers everything you need to know to architect and deploy microservices successfully.

## Service Decomposition

Learn how to break down monolithic applications into cohesive, loosely-coupled services. We''ll cover domain-driven design principles and bounded contexts.

## Communication Patterns

Explore synchronous vs. asynchronous communication, message queues, event-driven architecture, and API gateways. Understand when to use each pattern.

## Data Management

Handle distributed data challenges with patterns like database-per-service, saga patterns, and event sourcing. Learn how to maintain data consistency across services.

## Deployment and Orchestration

Master containerization with Docker and orchestration with Kubernetes. Set up CI/CD pipelines for seamless deployments.

## Monitoring and Observability

Implement distributed tracing, centralized logging, and metrics collection. Learn to troubleshoot issues in complex distributed systems.

This premium content gives you battle-tested strategies from real-world microservices implementations.',
  'premium',
  true
),
(
  'Security Best Practices for Modern Web Apps',
  'security-best-practices',
  'Protect your applications from common vulnerabilities and attacks.',
  'Security should never be an afterthought. This guide covers essential security practices every developer needs to know.

## Authentication and Authorization

Implement secure authentication flows with JWT, OAuth2, and OpenID Connect. Learn about session management, token refresh, and secure storage.

## Input Validation and Sanitization

Prevent injection attacks by properly validating and sanitizing all user input. We cover SQL injection, XSS, and command injection prevention.

## API Security

Secure your APIs with rate limiting, API keys, OAuth scopes, and CORS policies. Learn to detect and prevent API abuse.

## Encryption

Understand encryption at rest and in transit. Learn about TLS/SSL, certificate management, and end-to-end encryption.

## Security Headers

Configure security headers like CSP, HSTS, X-Frame-Options, and more. Understand what each header does and why it matters.

## Vulnerability Scanning

Set up automated security scanning in your CI/CD pipeline. Learn to identify and patch vulnerabilities before they reach production.

Premium content includes real security audit checklists and incident response plans.',
  'premium',
  true
),

-- Enterprise Articles (2)
(
  'Enterprise-Grade Infrastructure Design',
  'enterprise-infrastructure',
  'Design and implement infrastructure that scales to millions of users.',
  'Building infrastructure that supports millions of users requires careful planning and expert knowledge. This enterprise guide reveals the secrets of massive-scale systems.

## Multi-Region Architecture

Design globally distributed systems with low latency worldwide. Learn about DNS routing, edge caching, and regional failover strategies.

## High Availability

Achieve 99.99% uptime with redundancy, load balancing, and automated failover. We cover active-active and active-passive configurations.

## Disaster Recovery

Implement comprehensive backup and recovery strategies. Learn about RTO, RPO, and building resilient systems that survive catastrophic failures.

## Cost Optimization

Manage cloud costs at scale with reserved instances, spot instances, and intelligent resource allocation. Learn to optimize your infrastructure spend without sacrificing performance.

## Compliance and Governance

Meet regulatory requirements like GDPR, HIPAA, and SOC 2. Implement audit trails, access controls, and compliance monitoring.

## Performance at Scale

Handle millions of concurrent users with advanced load balancing, auto-scaling, and performance optimization techniques.

This enterprise-level content is based on systems handling billions of requests per day.',
  'enterprise',
  true
),
(
  'Building a Custom Analytics Platform',
  'custom-analytics-platform',
  'Create real-time analytics systems that process billions of events.',
  'Modern analytics platforms need to handle massive data volumes in real-time. This enterprise guide shows you how to build systems that rival Google Analytics.

## Data Pipeline Architecture

Design data pipelines that ingest, transform, and analyze billions of events per day. Learn about stream processing, batch processing, and lambda architecture.

## Real-Time Processing

Implement real-time analytics with Apache Kafka, Apache Flink, and ClickHouse. Process and aggregate data with sub-second latency.

## Data Warehousing

Build efficient data warehouses using columnar databases like Redshift, BigQuery, or Snowflake. Optimize for analytical queries.

## Visualization and Dashboards

Create interactive dashboards that update in real-time. Learn about efficient data aggregation and caching strategies for responsive UIs.

## Machine Learning Integration

Incorporate ML models for predictive analytics, anomaly detection, and user behavior analysis. Deploy models at scale.

## Privacy and Consent Management

Handle user privacy correctly with opt-in/opt-out mechanisms, data retention policies, and GDPR compliance.

Enterprise content includes production-ready code examples and deployment templates.',
  'enterprise',
  true
)

ON CONFLICT (slug) DO NOTHING;

-- Verify the insert
SELECT COUNT(*) as total_articles,
       SUM(CASE WHEN required_tier = 'free' THEN 1 ELSE 0 END) as free_count,
       SUM(CASE WHEN required_tier = 'premium' THEN 1 ELSE 0 END) as premium_count,
       SUM(CASE WHEN required_tier = 'enterprise' THEN 1 ELSE 0 END) as enterprise_count
FROM public.content;
