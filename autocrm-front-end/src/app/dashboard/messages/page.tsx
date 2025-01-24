'use client';

import { useEffect } from 'react';
import { useDirectMessageStore, useAuthStore, useMessagesStore } from '@/lib/store';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import Chat from '@/components/messages/chat';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const { 
    directMessages,
    fetchDirectMessagesByUser,
    setSelectedDirectMessage,
    error 
  } = useDirectMessageStore();

  const { messages } = useMessagesStore();

  useEffect(() => {
    if (user) {
      fetchDirectMessagesByUser(user.id);
    }
  }, [user, fetchDirectMessagesByUser]);

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-center">Please sign in to view messages</CardTitle>
//           </CardHeader>
//         </Card>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-center">Loading messages...</CardTitle>
//           </CardHeader>
//         </Card>
//       </div>
//     );
//   }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Error: {error}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Contacts List */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          <div className="space-y-2">
            {directMessages.map((dm) => {
              const contact = dm.sender_id === user?.id ? dm.recipient : dm.sender;
              return (
                <div
                  key={dm.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedDirectMessage(dm)}
                >
                  <Avatar>
                    <AvatarFallback>
                      {contact?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {contact?.email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {messages[dm.id]?.length || 0} messages
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Chat />
    </div>
  );
} 