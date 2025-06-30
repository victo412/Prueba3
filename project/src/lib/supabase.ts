import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Environment check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'missing',
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

console.log('🚀 Initializing Supabase client...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'lefi-app@1.0.0'
    }
  },
  // Add timeout configuration
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Test connection with timeout
console.log('🔍 Testing Supabase connection...');

const testConnection = async () => {
  try {
    // Set a timeout for the connection test
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 5000);
    });

    const sessionPromise = supabase.auth.getSession();

    const { data, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;

    if (error) {
      console.error('❌ Supabase connection error:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
      console.log('📊 Session status:', data.session ? 'Active session found' : 'No active session');
    }
  } catch (err: any) {
    if (err.message === 'Connection timeout') {
      console.error('❌ Supabase connection timeout - check your internet connection');
    } else {
      console.error('❌ Failed to test Supabase connection:', err);
    }
  }
};

testConnection();

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password_hash: string;
          created_at: string;
          onboarding_data: any;
          has_onboarded: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password_hash?: string;
          created_at?: string;
          onboarding_data?: any;
          has_onboarded?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password_hash?: string;
          created_at?: string;
          onboarding_data?: any;
          has_onboarded?: boolean;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string | null;
          user_id: string;
          title: string;
          description: string | null;
          status: string;
          priority: number;
          scheduled_start: string | null;
          scheduled_end: string | null;
          value_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          user_id: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: number;
          scheduled_start?: string | null;
          scheduled_end?: string | null;
          value_score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string | null;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: number;
          scheduled_start?: string | null;
          scheduled_end?: string | null;
          value_score?: number | null;
          created_at?: string;
        };
      };
    };
  };
}