import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { ArticleWithAuthor } from '@/app/types/database.types'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{
    id: string
  }>
}

async function getArticle(articleId: string) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ 
    cookies: () => cookieStore 
  })

  const { data: article } = await supabase
    .from('articles')
    .select('*, profiles(username, display_name)')
    .eq('id', articleId)
    .single()

  return article
}

export default async function ArticlePage({ params }: Props) {
  // paramsをawaitして値を取得
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    notFound()
  }

  const typedArticle = article as ArticleWithAuthor

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-4">{typedArticle.title}</h1>
        <div className="mb-8 text-gray-600">
          <div>
            作成者: {typedArticle.profiles.display_name || typedArticle.profiles.username}
          </div>
          <div>
            投稿日: {format(new Date(typedArticle.created_at), 'PPP', { locale: ja })}
          </div>
        </div>
        <div className="prose">
          <ReactMarkdown>{typedArticle.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}