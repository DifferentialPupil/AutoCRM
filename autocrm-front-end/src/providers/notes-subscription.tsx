'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNotesStore } from '@/lib/store';
import { InternalNote } from '@/types/schema';

export function NotesSubscriptionProvider({ 
  children,
  ticketId 
}: { 
  children: React.ReactNode;
  ticketId: string;
}) {
  const { 
    fetchNotes,
    handleNoteCreated,
    handleNoteUpdated,
    handleNoteDeleted
  } = useNotesStore();

  useEffect(() => {
    // Initial fetch
    fetchNotes(ticketId);

    // Subscribe to changes
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'internal_notes',
          filter: `ticket_id=eq.${ticketId}`
        },
        ({ new: newNote }) => {
          handleNoteCreated(newNote as InternalNote);
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'internal_notes',
          filter: `ticket_id=eq.${ticketId}`
        },
        ({ new: newNote }) => {
          handleNoteUpdated(newNote as InternalNote);
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'internal_notes',
          filter: `ticket_id=eq.${ticketId}`
        },
        ({ old: oldNote }) => {
          handleNoteDeleted(oldNote.id);
        }
      )
      .subscribe();

    return () => {
      console.log("Unsubscribing from notes changes");
      supabase.removeChannel(channel);
    };
  }, [ticketId, fetchNotes, handleNoteCreated, handleNoteUpdated, handleNoteDeleted]);

  return children;
}
