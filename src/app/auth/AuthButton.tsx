'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { AuthError } from '@supabase/supabase-js'

export default function AuthButton() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
            data: {
              username: username || email.split('@')[0],
              display_name: username || email.split('@')[0]
            }
          }
        })
        if (error) throw error
        alert('確認メールを送信しました。メールをご確認ください。')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: unknown) {
      console.error(error)
      const authError = error as AuthError
      alert(authError.message || 'エラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? 'アカウント作成' : 'ログイン'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ユーザー名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              pattern="[a-zA-Z0-9_-]+"
              title="半角英数字とハイフン、アンダースコアのみ使用可能です"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading
            ? '処理中...'
            : isSignUp
            ? 'アカウントを作成'
            : 'ログイン'}
        </button>
      </form>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full mt-4 text-sm text-blue-500 hover:text-blue-600"
      >
        {isSignUp ? 'ログインする' : 'アカウントを作成する'}
      </button>
    </div>
  )
}