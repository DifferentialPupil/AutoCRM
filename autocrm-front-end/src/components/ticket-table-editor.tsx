import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Ticket, TicketStatus } from "@/types/schema";
import { memo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuthStore, useNotesStore } from "@/lib/store";
import { InternalNote } from "@/types/schema";
import { Notes } from "./tickets/notes";
import { NotesSubscriptionProvider } from "@/providers/notes-subscription";

interface TicketEditorProps {
  ticket: Ticket;
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => Promise<void>;
}

export function TicketEditor({ ticket, onStatusChange }: TicketEditorProps) {
    const [newNote, setNewNote] = useState("");
    const [ticketStatus, setTicketStatus] = useState(ticket.status);
    const { user } = useAuthStore();
    const { createNote } = useNotesStore();

    async function handleAddNote() {
        if (!newNote.trim()) return;
        createNote({
            note_content: newNote,
            ticket_id: ticket.id,
            user_id: user?.id || ""
        });
        setNewNote("");
    }

    const handleSheetClose = () => {
        onStatusChange(ticket.id, ticketStatus);
    }

    const MemoizedNotes = memo(Notes, () => {return true});

  return (
    <Sheet onOpenChange={(open) => {
        if (!open) {
          handleSheetClose();
        }
    }}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          Edit Ticket
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ticket #{ticket.id}: {ticket.title}</SheetTitle>
          <SheetDescription>
            Created on {new Date(ticket.created_at).toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <select
                className="w-full rounded-md border p-2"
                value={ticketStatus}
                onChange={(e) => setTicketStatus(e.target.value as TicketStatus)}
              >
                <option value="open">Open</option>
                <option value="pending">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Priority</h3>
              <span className={`px-2 py-1 rounded-full text-sm ${
                ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                ticket.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {ticket.priority}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Customer</h3>
              <p className="text-sm text-muted-foreground">{ticket.customer?.email}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-4">Internal Notes</h3>
              <div className="space-y-4">
                
                <NotesSubscriptionProvider ticketId={ticket.id}>
                  <MemoizedNotes />
                </NotesSubscriptionProvider>
                {/* {notes.map((note) => (
                  <div key={note.id} className="bg-muted p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{note.note_content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Added by {note.user?.email} on {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                ))} */}

                <div className="space-y-2">
                  {user ? (
                    <>
                      <Textarea
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <Button 
                        onClick={handleAddNote} 
                      >
                        Add Note
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Please sign in to add notes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 