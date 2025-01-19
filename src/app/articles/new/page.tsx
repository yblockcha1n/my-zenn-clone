'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { ArticleInput } from '@/app/types/database.types'

export default function NewArticlePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent, published: boolean) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ログインが必要です')

      const articleData: ArticleInput = {
        title,
        content,
        published,
        author_id: user.id
      }

      const { error } = await supabase
        .from('articles')
        .insert(articleData)

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('エラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    if (!title.trim() || !content.trim()) {
      alert('タイトルと本文を入力してください。')
      return
    }
    setIsPreview(!isPreview)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">新規記事作成</h1>
        <button
          onClick={handlePreview}
          className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
        >
          {isPreview ? '編集に戻る' : 'プレビュー'}
        </button>
      </div>

      {!isPreview ? (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトル"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="マークダウン形式で記事を書く"
              className="w-full h-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={(e) => handleSubmit(e, false)}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              下書き保存
            </button>
            <button
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              公開する
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <div className="prose">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}