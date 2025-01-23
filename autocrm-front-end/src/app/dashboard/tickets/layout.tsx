// app/(dashboard)/layout.tsx
'use client';

import { TicketSubscriptionProvider } from '@/providers/ticket-subscription';

export default function TicketsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <TicketSubscriptionProvider>
        {children}
    </TicketSubscriptionProvider>
  );
}