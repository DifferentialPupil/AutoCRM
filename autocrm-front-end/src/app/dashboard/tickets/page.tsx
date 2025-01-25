"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  DndContext, 
  DragEndEvent, 
  MouseSensor, 
  TouchSensor, 
  useSensor, 
  useSensors,
  useDroppable,
  useDraggable
} from '@dnd-kit/core';
import { useState } from 'react';
import { TicketEditor } from '@/components/tickets/ticket-table-editor';
import { Ticket, TicketStatus, TicketPriority } from '@/types/schema';
import { useAuthStore, useTicketStore } from '@/lib/store';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function DraggableTicketCard({ 
  ticket,
  onStatusChange
}: { 
  ticket: Ticket;
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => Promise<void>;
}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `ticket-${ticket.id}`,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card className="mb-4 cursor-move select-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{ticket.title}</CardTitle>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-sm ${
                ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                ticket.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {ticket.priority}
              </span>
              <TicketEditor ticket={ticket} onStatusChange={onStatusChange} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Customer: {ticket.customer_id}</p>
            <p>Created: {new Date(ticket.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TicketColumn({ 
  title, 
  tickets,
  status,
  id,
  onStatusChange,
}: { 
  title: string; 
  tickets: Ticket[];
  status: TicketStatus;
  id: string;
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => Promise<void>;
}) {
  const { setNodeRef } = useDroppable({
    id: id,
  });
  
  const filteredTickets = tickets.filter(ticket => ticket.status === status);
  
  return (
    <div 
      ref={setNodeRef}
      className="flex-1 min-w-[300px] bg-muted/30 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">
          {filteredTickets.length} tickets
        </span>
      </div>
      <Separator className="mb-4" />
      <div className="space-y-4">
        {filteredTickets.map(ticket => (
          <DraggableTicketCard 
            key={ticket.id} 
            ticket={ticket} 
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

export default function TicketsPage() {
  const { tickets, error, createTicket, updateTicket } = useTicketStore();
  const { user } = useAuthStore();

  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    priority: "low" as TicketPriority
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    })
  );

  async function handleStatusChange(ticketId: string, newStatus: TicketStatus) {
    updateTicket(ticketId, { status: newStatus });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) return;

    const ticketId = active.id.toString().replace('ticket-', '');
    const newStatus = over.id.toString().replace('column-', '') as TicketStatus;
    
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.status === newStatus) return;

    handleStatusChange(ticketId, newStatus);
  }

  const handleCreateTicket = async () => {
    createTicket({
      title: newTicket.title,
      priority: newTicket.priority,
      status: "open",
      customer_id: user?.id || "",
    });
    setIsCreatingTicket(false);
  };

  if (error) {
    return (
      <div>
        <div className="container mx-auto py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="container mx-auto py-5 px-2">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tickets</h1>
          <Dialog open={isCreatingTicket} onOpenChange={setIsCreatingTicket}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Ticket</DialogTitle>
                <DialogDescription>
                  Create a new support ticket. Fill out the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    placeholder="Enter ticket title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value: TicketPriority) => 
                      setNewTicket({ ...newTicket, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatingTicket(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTicket} disabled={!newTicket.title}>
                  Create Ticket
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <TicketColumn 
              title="Open" 
              tickets={tickets} 
              status="open"
              id="column-open"
              onStatusChange={handleStatusChange}
            />
            <TicketColumn 
              title="In Progress" 
              tickets={tickets} 
              status="pending"
              id="column-pending"
              onStatusChange={handleStatusChange}
            />
            <TicketColumn 
              title="Resolved" 
              tickets={tickets} 
              status="resolved"
              id="column-resolved"
              onStatusChange={handleStatusChange}
            />
          </div>
        </DndContext>
      </main>
    </div>
  );
} 