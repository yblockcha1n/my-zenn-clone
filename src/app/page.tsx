import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import type { ArticleWithAuthor } from './types/database.types'

export const dynamic = 'force-dynamic'

async function getData() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ 
    cookies: () => cookieStore 
  })

  const { data: { user } } = await supabase.auth.getUser()
  const { data: articles } = await supabase
    .from('articles')
    .select('*, profiles(username, display_name)')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(20)

  return {
    user,
    articles: (articles as ArticleWithAuthor[]) || []
  }
}

export default async function Home() {
  const { user, articles } = await getData()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">最新の記事</h1>
        {user ? (
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ダッシュボード
          </Link>
        ) : (
          <Link
            href="/auth"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ログイン
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-sm p-6">
            <Link href={`/articles/${article.id}`}>
              <h2 className="text-xl font-bold hover:text-blue-500 mb-2">
                {article.title}
              </h2>
            </Link>
            <div className="text-gray-600">
              作成者: {article.profiles.display_name || article.profiles.username}
            </div>
          </article>
        ))}
        {articles.length === 0 && (
          <p className="text-center text-gray-500">
            まだ記事がありません
          </p>
        )}
      </div>
    </div>
  )
}