'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useDirectMessageStore, useMessagesStore, useAuthStore } from '@/lib/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { message } from '@/actions/ai-agent';

export default function Chat() {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedDirectMessage, isSelectedDirectMessageAIAgent } = useDirectMessageStore();
  const { messages, createMessage, error } = useMessagesStore();
  const { user } = useAuthStore();

  // Get messages for the selected conversation
  const conversationMessages = useMemo(() => selectedDirectMessage 
    ? messages[selectedDirectMessage.id] || []
    : [], [messages, selectedDirectMessage]);

  const conversationError = selectedDirectMessage 
    ? error[selectedDirectMessage.id] || null
    : null;

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedDirectMessage || !newMessage.trim()) return;

    await createMessage(selectedDirectMessage.id, {
        content: newMessage.trim(),
        sender_id: user.id,
        channel_id: null,
        direct_message_id: selectedDirectMessage.id
      });

    if (isSelectedDirectMessageAIAgent()) {
      const result = await message(newMessage.trim());

      createMessage(selectedDirectMessage.id, {
        content: result,
        sender_id: '2c5dea55-3904-4aef-9439-048a4df68fba',
        channel_id: null,
        direct_message_id: selectedDirectMessage.id
      });
    }

    setNewMessage('');
  };

  if (!selectedDirectMessage) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4" />
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  const contact = selectedDirectMessage.sender_id === user?.id 
    ? selectedDirectMessage.recipient 
    : selectedDirectMessage.sender;

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {contact?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{contact?.email}</h3>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {conversationError && (
            <div className="text-center text-destructive">
              Error: {conversationError}
            </div>
          )}

          {conversationMessages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 max-w-[80%]',
                  isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>
                    {isOwn 
                      ? user.email?.charAt(0).toUpperCase()
                      : message.sender?.email?.charAt(0).toUpperCase()
                    }
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'rounded-lg p-3',
                    isOwn 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted rounded-tl-none'
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}