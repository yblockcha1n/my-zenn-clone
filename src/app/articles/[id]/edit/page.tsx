'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams, useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
//import type { ArticleWithAuthor } from '@/app/types/database.types'

export default function EditArticlePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth')
          return
        }

        const { data } = await supabase
          .from('articles')
          .select('*, profiles(username, display_name)')
          .eq('id', params.id)
          .single()

        if (!data) {
          router.push('/dashboard')
          return
        }

        if (data.author_id !== user.id) {
          router.push('/dashboard')
          return
        }

        setTitle(data.title)
        setContent(data.content)
      } catch (error) {
        console.error('Error fetching article:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [supabase, params.id, router])

  const handleSubmit = async (published: boolean) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          title,
          content,
          published,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating article:', error)
      alert('更新中にエラーが発生しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">記事の編集</h1>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            {isPreview ? '編集に戻る' : 'プレビュー'}
          </button>
        </div>

        {!isPreview ? (
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="タイトル"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[calc(100vh-300px)] px-4 py-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="マークダウン形式で記事を書く"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleSubmit(false)}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                下書き保存
              </button>
              <button
                onClick={() => handleSubmit(true)}
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                公開する
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <div className="prose max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}