import { create } from 'zustand';
import {
  AuthState,
  TicketFilters,
  TicketStore,
  UIState,
  TicketsState,
  TagsState,
  NotesStore,
  CustomFieldsState,
  CommentsState
} from '@/types/store';
import { supabase } from '@/lib/supabase';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  signOut: () => set({ user: null, session: null, error: null, isLoading: false }),
}));

export const useTicketStore = create<TicketStore>((set, get) => ({
  // Initial State
  tickets: [],
  selectedTicket: null,
  isLoading: false,
  error: null,

  // Fetch Actions
  fetchTickets: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('tickets')
        .select()
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tickets: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch tickets' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTicketById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('tickets')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ selectedTicket: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch ticket' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Mutations
  createTicket: async (ticket) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('tickets')
        .insert(ticket)
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create ticket' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTicket: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update ticket' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTicket: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete ticket' });
    } finally {
      set({ isLoading: false });
    }
  },

  // State Updates
  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Real-time Updates
  handleTicketCreated: (ticket) => {
    set((state) => ({
      tickets: [ticket, ...state.tickets]
    }));
  },

  handleTicketUpdated: (ticket) => {
    set((state) => ({
      tickets: state.tickets.map(t => t.id === ticket.id ? ticket : t),
      selectedTicket: state.selectedTicket?.id === ticket.id ? ticket : state.selectedTicket
    }));
  },

  handleTicketDeleted: (id) => {
    set((state) => ({
      tickets: state.tickets.filter(t => t.id !== id),
      selectedTicket: state.selectedTicket?.id === id ? null : state.selectedTicket
    }));
  }
}));

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'system',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));

export const useTagsStore = create<TagsState>((set) => ({
  tags: {},
  isLoading: false,
  error: null,
  setTags: (tags) => set({ 
    tags: tags.reduce((acc, tag) => ({ ...acc, [tag.id]: tag }), {}) 
  }),
  addTag: (tag) => set((state) => ({
    tags: { ...state.tags, [tag.id]: tag }
  })),
  removeTag: (tagId) => set((state) => {
    const newTags = { ...state.tags };
    delete newTags[tagId];
    return { tags: newTags };
  }),
  updateTag: (tagId, updates) => set((state) => ({
    tags: {
      ...state.tags,
      [tagId]: { ...state.tags[tagId], ...updates }
    }
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export const useNotesStore = create<NotesStore>((set, get) => ({
  // Initial State
  notes: [],
  selectedNote: null,
  isLoading: false,
  error: null,

  // Fetch Actions
  fetchNotes: async (ticketId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('internal_notes')
        .select()
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ notes: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch notes' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNoteById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('internal_notes')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ selectedNote: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch note' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Mutations
  createNote: async (note) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('internal_notes')
        .insert(note)
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create note' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateNote: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('internal_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update note' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteNote: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('internal_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete note' });
    } finally {
      set({ isLoading: false });
    }
  },

  // State Updates
  setSelectedNote: (note) => set({ selectedNote: note }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Real-time Updates
  handleNoteCreated: (note) => {
    set((state) => ({
      notes: [note, ...state.notes]
    }));
  },

  handleNoteUpdated: (note) => {
    set((state) => ({
      notes: state.notes.map(n => n.id === note.id ? note : n),
      selectedNote: state.selectedNote?.id === note.id ? note : state.selectedNote
    }));
  },

  handleNoteDeleted: (id) => {
    set((state) => ({
      notes: state.notes.filter(n => n.id !== id),
      selectedNote: state.selectedNote?.id === id ? null : state.selectedNote
    }));
  }
}));

export const useCustomFieldsStore = create<CustomFieldsState>((set) => ({
  fields: {},
  isLoading: false,
  error: null,
  setFields: (fields) => set({ 
    fields: fields.reduce((acc, field) => ({ ...acc, [field.id]: field }), {}) 
  }),
  addField: (field) => set((state) => ({
    fields: { ...state.fields, [field.id]: field }
  })),
  removeField: (fieldId) => set((state) => {
    const newFields = { ...state.fields };
    delete newFields[fieldId];
    return { fields: newFields };
  }),
  updateField: (fieldId, updates) => set((state) => ({
    fields: {
      ...state.fields,
      [fieldId]: { ...state.fields[fieldId], ...updates }
    }
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export const useCommentsStore = create<CommentsState>((set) => ({
  comments: {},
  isLoading: false,
  error: null,
  setComments: (comments) => set({ 
    comments: comments.reduce((acc, comment) => ({ ...acc, [comment.id]: comment }), {}) 
  }),
  addComment: (comment) => set((state) => ({
    comments: { ...state.comments, [comment.id]: comment }
  })),
  removeComment: (commentId) => set((state) => {
    const newComments = { ...state.comments };
    delete newComments[commentId];
    return { comments: newComments };
  }),
  updateComment: (commentId, updates) => set((state) => ({
    comments: {
      ...state.comments,
      [commentId]: { ...state.comments[commentId], ...updates }
    }
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 