import { User, Session } from '@supabase/supabase-js';
import { 
  Ticket, 
  Tag, 
  InternalNote, 
  CustomField, 
  TicketComment 
} from './schema';

export interface AuthState {
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

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export interface TagsState {
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

export interface CustomFieldsState {
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

export interface CommentsState {
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

export interface NotesStore {
  // Data
  notes: InternalNote[];
  selectedNote: InternalNote | null;
  
  // UI States
  isLoading: boolean;
  error: string | null;
  
  // Fetch Actions
  fetchNotes: (ticketId: string) => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  
  // Mutations
  createNote: (note: Omit<InternalNote, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<InternalNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  
  // State Updates
  setSelectedNote: (note: InternalNote | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Real-time Updates
  handleNoteCreated: (note: InternalNote) => void;
  handleNoteUpdated: (note: InternalNote) => void;
  handleNoteDeleted: (id: string) => void;
}

export interface TicketStore {
  // Data
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  
  // UI States
  isLoading: boolean;
  error: string | null;
  
  // Fetch Actions
  fetchTickets: () => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  fetchTicketsBySearch: (searchQuery: string) => Promise<void>;
  
  // Mutations
  createTicket: (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  
  // State Updates
  setSelectedTicket: (ticket: Ticket | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Real-time Updates
  handleTicketCreated: (ticket: Ticket) => void;
  handleTicketUpdated: (ticket: Ticket) => void;
  handleTicketDeleted: (id: string) => void;
}

export interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}
