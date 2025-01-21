import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { 
  Ticket, 
  Tag, 
  InternalNote, 
  CustomField, 
  TicketComment 
} from '@/types/schema';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => void;
}

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

interface TicketFilters {
  search: string;
  status: string[];
  priority: string[];
}

interface TicketState {
  filters: TicketFilters;
  setFilters: (filters: Partial<TicketFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: TicketFilters = {
  search: '',
  status: [],
  priority: [],
};

export const useTicketStore = create<TicketState>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) => 
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters } 
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'system',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));

interface TicketsState {
  tickets: Record<number, Ticket>;
  isLoading: boolean;
  error: string | null;
  setTickets: (tickets: Ticket[]) => void;
  updateTicket: (ticketId: number, updates: Partial<Ticket>) => void;
  addTicket: (ticket: Ticket) => void;
  removeTicket: (ticketId: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTicketsStore = create<TicketsState>((set) => ({
  tickets: {},
  isLoading: false,
  error: null,
  setTickets: (tickets) => set({ 
    tickets: tickets.reduce((acc, ticket) => ({ ...acc, [ticket.id]: ticket }), {}) 
  }),
  updateTicket: (ticketId, updates) => set((state) => ({
    tickets: {
      ...state.tickets,
      [ticketId]: { ...state.tickets[ticketId], ...updates }
    }
  })),
  addTicket: (ticket) => set((state) => ({
    tickets: { ...state.tickets, [ticket.id]: ticket }
  })),
  removeTicket: (ticketId) => set((state) => {
    const newTickets = { ...state.tickets };
    delete newTickets[ticketId];
    return { tickets: newTickets };
  }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

interface TagsState {
  tags: Record<number, Tag>;
  isLoading: boolean;
  error: string | null;
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  removeTag: (tagId: number) => void;
  updateTag: (tagId: number, updates: Partial<Tag>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

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

interface NotesState {
  notes: Record<number, InternalNote>;
  isLoading: boolean;
  error: string | null;
  setNotes: (notes: InternalNote[]) => void;
  addNote: (note: InternalNote) => void;
  removeNote: (noteId: number) => void;
  updateNote: (noteId: number, updates: Partial<InternalNote>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: {},
  isLoading: false,
  error: null,
  setNotes: (notes) => set({ 
    notes: notes.reduce((acc, note) => ({ ...acc, [note.id]: note }), {}) 
  }),
  addNote: (note) => set((state) => ({
    notes: { ...state.notes, [note.id]: note }
  })),
  removeNote: (noteId) => set((state) => {
    const newNotes = { ...state.notes };
    delete newNotes[noteId];
    return { notes: newNotes };
  }),
  updateNote: (noteId, updates) => set((state) => ({
    notes: {
      ...state.notes,
      [noteId]: { ...state.notes[noteId], ...updates }
    }
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

interface CustomFieldsState {
  fields: Record<number, CustomField>;
  isLoading: boolean;
  error: string | null;
  setFields: (fields: CustomField[]) => void;
  addField: (field: CustomField) => void;
  removeField: (fieldId: number) => void;
  updateField: (fieldId: number, updates: Partial<CustomField>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

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

interface CommentsState {
  comments: Record<number, TicketComment>;
  isLoading: boolean;
  error: string | null;
  setComments: (comments: TicketComment[]) => void;
  addComment: (comment: TicketComment) => void;
  removeComment: (commentId: number) => void;
  updateComment: (commentId: number, updates: Partial<TicketComment>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

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