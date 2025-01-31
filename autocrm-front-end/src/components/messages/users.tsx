'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUsersStore, useAuthStore } from '@/lib/store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User as AppUser } from '@/types/schema';

interface UsersProps {
  onSelect: (user: AppUser) => void;
}

export default function Users({ onSelect }: UsersProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const { users, fetchUsers, isLoading } = useUsersStore();

  // Filter users based on search query
  const filteredUsers = users.filter(u => {
    if (u.id === user?.id) return false; // Filter out current user
    if (!searchQuery.trim()) return true; // Show all users when no search query
    return u.email.toLowerCase().includes(searchQuery.toLowerCase()); // Filter by email
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => {
            fetchUsers();
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>Select a user to start a new direct message channel.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No users found
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelect(user);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent text-left"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 truncate max-w-xs" title={user.email}>{user.email}</span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
