'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { ArticleWithAuthor } from '@/app/types/database.types'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function DashboardPage() {
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth')
          return
        }

        const { data } = await supabase
          .from('articles')
          .select('*, profiles(username, display_name)')
          .eq('author_id', user.id)
          .order('created_at', { ascending: false })

        setArticles(data as ArticleWithAuthor[] || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <Link
            href="/articles/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            新規記事作成
          </Link>
        </div>

        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      href={`/articles/${article.id}`}
                      className="block text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <time dateTime={article.created_at}>
                        {format(new Date(article.created_at), 'PPP', { locale: ja })}
                      </time>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          article.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {article.published ? '公開中' : '下書き'}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/articles/${article.id}/edit`}
                    className="ml-4 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    編集
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">まだ記事がありません</h3>
              <p className="mt-2 text-gray-500">最初の記事を書いてみましょう</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}