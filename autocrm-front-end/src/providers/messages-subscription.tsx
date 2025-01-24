'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useDirectMessageStore, useMessagesStore, useAuthStore } from '@/lib/store';
import { Message } from '@/types/schema';

interface MessagesSubscriptionProviderProps {
  children: React.ReactNode;
}

export function MessagesSubscriptionProvider({ children }: MessagesSubscriptionProviderProps) {
  const { directMessages, selectedDirectMessage } = useDirectMessageStore();
  const { 
    handleMessageCreated,
    handleMessageUpdated,
    handleMessageDeleted,
    fetchMessages
  } = useMessagesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || directMessages.length === 0) return;

    // Initial fetch for all direct messages
    directMessages.forEach(dm => {
      fetchMessages(dm.id);
    });

    // Create a channel for all messages related to user's direct messages
    const channel = supabase
      .channel('table_db_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `direct_message_id=eq.${selectedDirectMessage?.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.direct_message_id) {
            handleMessageCreated(newMessage.direct_message_id, newMessage);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `direct_message_id=eq.${selectedDirectMessage?.id}`
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          if (updatedMessage.direct_message_id) {
            handleMessageUpdated(updatedMessage.direct_message_id, updatedMessage);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `direct_message_id=eq.${selectedDirectMessage?.id}`
        },
        (payload) => {
          const deletedMessage = payload.old as Message;
          if (deletedMessage.direct_message_id) {
            handleMessageDeleted(deletedMessage.direct_message_id, deletedMessage.id);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to messages changes');
        }
      });

    return () => {
      console.log('Unsubscribing from messages changes');
      supabase.removeChannel(channel);
    };
  }, [
    user,
    directMessages,
    selectedDirectMessage,
    handleMessageCreated,
    handleMessageUpdated,
    handleMessageDeleted,
    fetchMessages
  ]);

  return children;
}
