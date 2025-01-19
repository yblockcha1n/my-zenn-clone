'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { ArticleInput } from '@/app/types/database.types'
import type { AppError } from '@/types/error'
import { useToast } from '@/app/providers'

export default function NewArticlePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { showToast } = useToast()

  // タブの挙動を制御
  const handleTabKey = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      setContent(prev => 
        prev.substring(0, start) + '  ' + prev.substring(end)
      )
      // カーソル位置を調整
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2
      }, 0)
    }
  }, [])

  const handleSubmit = async (published: boolean) => {
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
      showToast({
        message: published ? '記事を公開しました' : '下書きを保存しました',
        type: 'success'
      })
    } catch (error) {
      const appError = error as AppError
      showToast({
        message: appError.message || 'エラーが発生しました',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // エディタにフォーカスを当てる
    editorRef.current?.focus()
  }, [])

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="記事のタイトル"
            className="w-full px-4 py-3 text-xl font-bold border-none rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-4 h-[calc(100vh-240px)]">
          {/* エディタ */}
          <div className="w-1/2 bg-white rounded-lg shadow-sm">
            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleTabKey}
              placeholder="マークダウン形式で記事を書く"
              className="w-full h-full p-4 resize-none font-mono text-sm border-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* プレビュー */}
          <div className="w-1/2 bg-white rounded-lg shadow-sm overflow-auto">
            <div className="p-4 prose max-w-none">
              <h1>{title || 'タイトル'}</h1>
              <ReactMarkdown>{content || 'ここにプレビューが表示されます'}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => handleSubmit(false)}
            disabled={isLoading || !title || !content}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            下書き保存
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isLoading || !title || !content}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            公開する
          </button>
        </div>
      </div>
    </div>
  )
}