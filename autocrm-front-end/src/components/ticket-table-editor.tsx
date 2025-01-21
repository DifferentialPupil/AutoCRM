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
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useAuthStore, useNotesStore } from "@/lib/store";

interface TicketEditorProps {
  ticket: Ticket;
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => Promise<void>;
}

export function TicketEditor({ ticket, onStatusChange }: TicketEditorProps) {
  const [newNote, setNewNote] = useState("");
  const { user } = useAuthStore();
  const { 
    notes,
    addNote,
    isLoading,
    setLoading,
    error,
    setError
  } = useNotesStore();

  // Filter notes for this ticket
  const ticketNotes = Object.values(notes).filter(note => note.ticket_id === ticket.id);

  async function handleAddNote() {
    if (!newNote.trim() || !user) {
      setError("Please enter a note and ensure you're logged in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('internal_notes')
        .insert([
          {
            ticket_id: ticket.id,
            note_content: newNote,
            user_id: user.id,
          }
        ])
        .select('*, user:users(email)')
        .single();

      if (insertError) throw insertError;

      if (!data) {
        throw new Error('No data returned from insert');
      }

      addNote(data);
      setNewNote("");
    } catch (err) {
      console.error('Error adding note:', err);
      setError(err instanceof Error ? err.message : 'Failed to add note');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet>
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
                value={ticket.status}
                onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
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
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}
                
                {ticketNotes.map((note) => (
                  <div key={note.id} className="bg-muted p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{note.note_content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Added by {note.user?.email} on {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}

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
                        disabled={isLoading || !newNote.trim()}
                      >
                        {isLoading ? "Adding..." : "Add Note"}
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