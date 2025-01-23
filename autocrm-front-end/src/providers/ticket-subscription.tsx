// providers/ticket-subscription.tsx
'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTicketStore } from '@/lib/store';
import { Ticket } from '@/types/schema';

export function TicketSubscriptionProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { 
    fetchTickets,
    handleTicketCreated,
    handleTicketUpdated,
    handleTicketDeleted
  } = useTicketStore();

  useEffect(() => {
    // Initial fetch
    fetchTickets();

    // Subscribe to changes
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tickets' },
        ({ new: newTicket }) => {
          handleTicketCreated(newTicket as Ticket);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tickets' },
        ({ new: newTicket }) => {
            handleTicketUpdated(newTicket as Ticket);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'tickets' },
        ({ old: oldTicket }) => {
            console.log("Attempting to delete ticket:", oldTicket);
            // handleTicketDeleted(oldTicket.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTickets, handleTicketCreated, handleTicketUpdated, handleTicketDeleted]);

  return children;
}