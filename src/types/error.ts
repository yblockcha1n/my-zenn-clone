import type { AuthError } from '@supabase/supabase-js'

export type AppError = AuthError | Error

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof Error && 'status' in error
}