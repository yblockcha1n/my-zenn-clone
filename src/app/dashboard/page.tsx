import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { ArticleWithAuthor } from '@/app/types/database.types'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data: articles } = await supabase
    .from('articles')
    .select('*, profiles(username, display_name)')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  const typedArticles = articles as ArticleWithAuthor[] || []

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <Link
          href="/articles/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          新規記事作成
        </Link>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">あなたの記事一覧</h2>
          </div>
          <div className="divide-y">
            {typedArticles.map((article) => (
              <div key={article.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <Link 
                      href={`/articles/${article.id}`}
                      className="text-lg font-medium hover:text-blue-500"
                    >
                      {article.title}
                    </Link>
                    <div className="mt-1 text-sm text-gray-600">
                      作成日: {format(new Date(article.created_at), 'PPP', { locale: ja })}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      article.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {article.published ? '公開中' : '下書き'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {typedArticles.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                まだ記事がありません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
