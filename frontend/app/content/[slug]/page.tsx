import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserProfile, getContentBySlug } from '@/app/actions/profile'
import { ContentLock } from '@/components/paywall/ContentLock'
import { getTierDisplayName, getTierBadgeClasses } from '@/lib/subscription/utils'
import { MarkdownContent } from '@/components/content/MarkdownContent'

interface ContentPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ContentDetailPage({ params }: ContentPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get content by slug
  const content = await getContentBySlug(slug)

  if (!content) {
    notFound()
  }

  // Get user profile if logged in
  const userProfile = user ? await getCurrentUserProfile() : null

  // Extract first paragraph as preview
  const contentPreview = content.content.split('\n\n')[0]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold">
              WKND_CO
            </Link>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <span className="text-white/60">|</span>
                  <span className="text-sm text-white/60">{user.email}</span>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-md bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Link href="/content" className="hover:text-white transition-colors">
              Content
            </Link>
            <span>/</span>
            <span className="text-white/80">{content.title}</span>
          </div>

          {/* Article Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTierBadgeClasses(content.required_tier)}`}>
                {getTierDisplayName(content.required_tier)}
              </span>
              <span className="text-sm text-white/40">
                {new Date(content.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {content.title}
            </h1>

            <p className="text-lg text-white/60">
              {content.description}
            </p>
          </div>

          {/* Content with Paywall */}
          <div className="border-t border-white/10 pt-8">
            <ContentLock
              userProfile={userProfile}
              requiredTier={content.required_tier}
              contentTitle={content.title}
              contentPreview={contentPreview}
              showPreview={true}
            >
              <MarkdownContent content={content.content} />
            </ContentLock>
          </div>

          {/* Back Navigation */}
          <div className="border-t border-white/10 pt-8">
            <Link
              href="/content"
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to content library
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
