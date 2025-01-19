'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export type ToastProps = {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = ({ message, type = 'info', duration = 3000 }: ToastProps) => {
    setToast({ message, type, duration })
  }

  return { showToast, toast, setToast }
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps & { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const backgroundColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type]

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50">
      <div className={`${backgroundColor} text-white px-6 py-3 rounded-lg shadow-lg`}>
        {message}
      </div>
    </div>,
    document.body
  )
}
