export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          content: string
          published: boolean
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          published?: boolean
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          published?: boolean
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Article = Database['public']['Tables']['articles']['Row']
export type ArticleWithAuthor = Article & {
  profiles: Pick<Profile, 'username' | 'display_name'>
}
export type ArticleInput = Omit<
  Database['public']['Tables']['articles']['Insert'],
  'id' | 'created_at' | 'updated_at'
>