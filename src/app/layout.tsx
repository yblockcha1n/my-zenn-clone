import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Zenn Clone',
  description: 'A Zenn-like article posting service',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow bg-gray-50">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}