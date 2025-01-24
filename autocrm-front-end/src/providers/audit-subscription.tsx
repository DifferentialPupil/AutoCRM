'use client';

import { useEffect } from 'react';
import { useAuditStore, useSearchStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { AuditLog } from '@/types/schema';

interface AuditSubscriptionProviderProps {
  children: React.ReactNode;
}

export function AuditSubscriptionProvider({ children }: AuditSubscriptionProviderProps) {
  const { fetchAuditLogs, fetchAuditLogsBySearch, handleAuditLogCreated } = useAuditStore();
  const { searchQuery } = useSearchStore();

  useEffect(() => {
    if (searchQuery) {
        fetchAuditLogsBySearch(searchQuery);
        return;
    }

    fetchAuditLogs();

    const channel = supabase
      .channel('table_db_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs'
        },
        (payload) => {
          const newLog = payload.new as AuditLog;
          handleAuditLogCreated(newLog);
        }
      )
      .subscribe();

    return () => {
        console.log('Unsubscribing from audit logs');
        supabase.removeChannel(channel);
    };
  }, [handleAuditLogCreated, searchQuery, fetchAuditLogs, fetchAuditLogsBySearch]);

  return <>{children}</>;
} 