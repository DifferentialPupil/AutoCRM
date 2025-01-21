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
      users: {
        Row: {
          id: number
          email: string
          password_hash: string
          role: 'customer' | 'employee' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          email: string
          password_hash: string
          role?: 'customer' | 'employee' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          email?: string
          password_hash?: string
          role?: 'customer' | 'employee' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: number
          title: string
          status: 'open' | 'pending' | 'resolved'
          priority: 'low' | 'medium' | 'high'
          customer_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          status?: 'open' | 'pending' | 'resolved'
          priority?: 'low' | 'medium' | 'high'
          customer_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          status?: 'open' | 'pending' | 'resolved'
          priority?: 'low' | 'medium' | 'high'
          customer_id?: number
          created_at?: string
          updated_at?: string
        }
      }
      internal_notes: {
        Row: {
          id: number
          ticket_id: number
          user_id: number
          note_content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          ticket_id: number
          user_id: number
          note_content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          ticket_id?: number
          user_id?: number
          note_content?: string
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      ticket_tags: {
        Row: {
          id: number
          ticket_id: number
          tag_id: number
        }
        Insert: {
          id?: number
          ticket_id: number
          tag_id: number
        }
        Update: {
          id?: number
          ticket_id?: number
          tag_id?: number
        }
      }
      custom_fields: {
        Row: {
          id: number
          name: string
          field_type: 'text' | 'number' | 'date' | 'select'
          required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          field_type: 'text' | 'number' | 'date' | 'select'
          required?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          field_type?: 'text' | 'number' | 'date' | 'select'
          required?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ticket_custom_fields: {
        Row: {
          id: number
          ticket_id: number
          custom_field_id: number
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          ticket_id: number
          custom_field_id: number
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          ticket_id?: number
          custom_field_id?: number
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
      ticket_comments: {
        Row: {
          id: number
          ticket_id: number
          user_id: number
          comment_content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          ticket_id: number
          user_id: number
          comment_content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          ticket_id?: number
          user_id?: number
          comment_content?: string
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