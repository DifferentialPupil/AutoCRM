'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log("Unsubscribing from auth changes");
      subscription.unsubscribe();
      supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    };
  }, [setLoading, setSession, setUser]);

  return children;
} 