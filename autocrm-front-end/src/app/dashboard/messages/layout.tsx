'use client';

import { DirectMessageSubscriptionProvider } from '@/providers/direct-message-subscription';
import { MessagesSubscriptionProvider } from '@/providers/messages-subscription';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DirectMessageSubscriptionProvider>
      <MessagesSubscriptionProvider>
        {children}
      </MessagesSubscriptionProvider>
    </DirectMessageSubscriptionProvider>
  );
} 