'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkAuth()
  }, [supabase.auth])

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }, [supabase, router])

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              My Zenn Clone
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/articles/new"
                  className="text-gray-700 hover:text-gray-900"
                >
                  投稿する
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900"
                >
                  ダッシュボード
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-gray-900"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="text-gray-700 hover:text-gray-900"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}