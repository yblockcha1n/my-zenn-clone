import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import type { ArticleWithAuthor } from './types/database.types'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: articles } = await supabase
    .from('articles')
    .select('*, profiles(username, display_name)')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(20)

  const typedArticles = articles as ArticleWithAuthor[] || []

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {typedArticles.map((article) => (
            <Link 
              key={article.id}
              href={`/articles/${article.id}`}
              className="block group"
            >
              <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                    {article.content.replace(/[#*`]/g, '').slice(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="font-medium">
                      {article.profiles.display_name || article.profiles.username}
                    </span>
                    <time dateTime={article.created_at}>
                      {format(new Date(article.created_at), 'PP', { locale: ja })}
                    </time>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {typedArticles.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">まだ記事がありません</h3>
            <p className="mt-2 text-gray-500">最初の記事を投稿してみましょう</p>
          </div>
        )}
      </div>
    </div>
  )
}