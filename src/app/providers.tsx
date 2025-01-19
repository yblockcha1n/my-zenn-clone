'use client'

import { createContext, useContext, useState } from 'react'
import { Toast, ToastProps } from '@/components/ui/toast'

const ToastContext = createContext<{
  showToast: (props: ToastProps) => void
}>({
  showToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastProps | null>(null)

  const showToast = (props: ToastProps) => {
    setToast(props)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast {...toast} onClose={() => setToast(null)} />
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)