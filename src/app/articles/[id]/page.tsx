'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { ArticleWithAuthor } from '@/app/types/database.types'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Components } from 'react-markdown'
import type { CSSProperties } from 'react'

export default function ArticlePage() {
  const [article, setArticle] = useState<ArticleWithAuthor | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await supabase
          .from('articles')
          .select('*, profiles(username, display_name)')
          .eq('id', params.id)
          .single()

        setArticle(data as ArticleWithAuthor)
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchArticle()
    }
  }, [supabase, params.id])

  const CodeBlock: Components['code'] = ({ className, children }) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : 'text'
    const codeString = String(children).replace(/\n$/, '')

    const syntaxHighlighterStyle: Record<string, CSSProperties> = {
      ...vscDarkPlus,
      'pre[class*="language-"]': {
        ...vscDarkPlus['pre[class*="language-"]'],
        background: '#1a202c',
        padding: '1em',
        borderRadius: '0.5em',
        overflow: 'auto'
      }
    }
    
    return (
      <SyntaxHighlighter
        style={syntaxHighlighterStyle}
        language={language}
        PreTag="div"
      >
        {codeString}
      </SyntaxHighlighter>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"/>
            <div className="h-4 bg-gray-200 rounded w-1/4"/>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"/>
              <div className="h-4 bg-gray-200 rounded"/>
              <div className="h-4 bg-gray-200 rounded w-5/6"/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">記事が見つかりません</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <article className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8 border-b pb-4">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">
                  {article.profiles.display_name || article.profiles.username}
                </span>
              </div>
              <time dateTime={article.created_at}>
                {format(new Date(article.created_at), 'PPP', { locale: ja })}
              </time>
            </div>

            <div className="markdown-content prose">
              <ReactMarkdown
                components={{
                  code: CodeBlock
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}