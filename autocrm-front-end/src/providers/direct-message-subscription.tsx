'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useDirectMessageStore, useAuthStore } from '@/lib/store';
import { DirectMessage } from '@/types/schema';

interface DirectMessageSubscriptionProviderProps {
  children: React.ReactNode;
}

export function DirectMessageSubscriptionProvider({ children }: DirectMessageSubscriptionProviderProps) {
  const { 
    fetchDirectMessagesByUser,
    handleDirectMessageCreated,
    handleDirectMessageUpdated,
    handleDirectMessageDeleted
  } = useDirectMessageStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Initial fetch of user's direct messages
    fetchDirectMessagesByUser(user.id);

    // Also subscribe to new direct messages where the user is sender or recipient
    const channel = supabase
      .channel(`table_db_changes`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `sender_id=eq.${user.id}`
        },
        (payload) => {
            console.log("newDM", payload.new);
          handleDirectMessageCreated(payload.new as DirectMessage);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
            console.log("newDM", payload.new);
          handleDirectMessageCreated(payload.new as DirectMessage);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to direct message changes');
        }
      });

    return () => {
      console.log('Unsubscribing from direct message changes');
      // Cleanup all channels
      supabase.removeChannel(channel);
    };
  }, [
    fetchDirectMessagesByUser,
    handleDirectMessageCreated,
    handleDirectMessageUpdated,
    handleDirectMessageDeleted
  ]);

  return children;
} 