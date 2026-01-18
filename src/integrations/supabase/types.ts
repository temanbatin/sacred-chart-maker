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
      affiliates: {
        Row: {
          balance: number | null
          bank_info: Json | null
          coupon_code: string | null
          created_at: string | null
          id: string
          status: string | null
          total_earnings: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          bank_info?: Json | null
          coupon_code?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          bank_info?: Json | null
          coupon_code?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string
        }
      }
      articles: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
      }
      commissions: {
        Row: {
          affiliate_id: string | null
          amount: number
          created_at: string | null
          id: string
          order_id: string | null
          status: string | null
        }
        Insert: {
          affiliate_id?: string | null
          amount: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
        }
        Update: {
          affiliate_id?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          status?: string | null
        }
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          discount_value: number
          id: string
          is_active: boolean | null
          usage_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          discount_value: number
          id?: string
          is_active?: boolean | null
          usage_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          discount_value?: number
          id?: string
          is_active?: boolean | null
          usage_count?: number | null
        }
      }
      leads: {
        Row: {
          birth_date: string | null
          birth_place: string | null
          created_at: string
          email: string
          id: string
          ip_address: string | null
          name: string
          user_agent: string | null
          whatsapp: string
        }
        Insert: {
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          name: string
          user_agent?: string | null
          whatsapp: string
        }
        Update: {
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          name?: string
          user_agent?: string | null
          whatsapp?: string
        }
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          metadata: Json | null
          paid_at: string | null
          payment_method: string | null
          payment_url: string | null
          product_name: string
          reference_id: string
          report_url: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          payment_url?: string | null
          product_name: string
          reference_id: string
          report_url?: string | null
          status: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          payment_url?: string | null
          product_name?: string
          reference_id?: string
          report_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          role?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
      }
      saved_charts: {
        Row: {
          birth_date: string
          birth_place: string | null
          birth_time: string | null
          chart_data: Json | null
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          birth_date: string
          birth_place?: string | null
          birth_time?: string | null
          chart_data?: Json | null
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          birth_date?: string
          birth_place?: string | null
          birth_time?: string | null
          chart_data?: Json | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
