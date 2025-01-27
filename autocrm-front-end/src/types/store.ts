import { User, Session } from '@supabase/supabase-js';
import { 
  Ticket, 
  Tag, 
  InternalNote, 
  CustomField, 
  TicketComment,
  AuditLog,
  DirectMessage,
  Message,
  User as AppUser,
  Template,
  ArticleMetadata,
  KnowledgeBaseArticle
} from './schema';

export interface UsersStore {
  // Data
  users: AppUser[];
  selectedUser: AppUser | null;
  
  // UI States
  isLoading: boolean;
  error: string | null;
  
  // Fetch Actions
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  fetchUsersByRole: (role: AppUser['role']) => Promise<void>;
  fetchUsersBySearch: (searchQuery: string) => Promise<void>;
  
  // Mutations
  updateUser: (id: string, updates: Partial<AppUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // State Updates
  setSelectedUser: (user: AppUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Real-time Updates
  handleUserUpdated: (user: AppUser) => void;
  handleUserDeleted: (id: string) => void;
}

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

export interface AuditStore {
  // Data
  auditLogs: AuditLog[];
  
  // UI States
  isLoading: boolean;
  error: string | null;
  
  // Fetch Actions
  fetchAuditLogs: () => Promise<void>;
  fetchAuditLogsByTable: (tableName: string) => Promise<void>;
  fetchAuditLogsByUser: (userId: string) => Promise<void>;
  fetchAuditLogsBySearch: (searchQuery: string) => Promise<void>;
  
  // State Updates
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Real-time Updates
  handleAuditLogCreated: (log: AuditLog) => void;
  
  // Analytics
  getOperationCounts: () => Record<string, number>;
  getTableActivityCounts: () => Record<string, number>;
  getUserActivityCounts: () => Record<string, number>;
  getActivityTimeline: () => { date: string; count: number }[];
}

export interface DirectMessageStore {
  // Data
  directMessages: DirectMessage[];
  selectedDirectMessage: DirectMessage | null;
  
  // UI States
  isLoading: boolean;
  error: string | null;
  
  // Fetch Actions
  fetchDirectMessages: () => Promise<void>;
  fetchDirectMessageById: (id: string) => Promise<void>;
  fetchDirectMessagesByUser: (userId: string) => Promise<void>;
  
  // Mutations
  createDirectMessage: (directMessage: Omit<DirectMessage, 'id' | 'created_at'>) => Promise<void>;
  updateDirectMessage: (id: string, updates: Partial<DirectMessage>) => Promise<void>;
  deleteDirectMessage: (id: string) => Promise<void>;
  
  // State Updates
  setSelectedDirectMessage: (directMessage: DirectMessage | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Real-time Updates
  handleDirectMessageCreated: (directMessage: DirectMessage) => void;
  handleDirectMessageUpdated: (directMessage: DirectMessage) => void;
  handleDirectMessageDeleted: (id: string) => void;
}

export interface MessagesStore {
  // Data
  messages: Record<string, Message[]>; // directMessageId -> messages[]
  
  // UI States
  isLoading: Record<string, boolean>;
  error: Record<string, string | null>;
  
  // Fetch Actions
  fetchMessages: (directMessageId: string) => Promise<void>;
  
  // Mutations
  createMessage: (directMessageId: string, message: Omit<Message, 'id' | 'created_at'>) => Promise<void>;
  updateMessage: (directMessageId: string, messageId: string, updates: Partial<Message>) => Promise<void>;
  deleteMessage: (directMessageId: string, messageId: string) => Promise<void>;
  
  // State Updates
  setLoading: (directMessageId: string, isLoading: boolean) => void;
  setError: (directMessageId: string, error: string | null) => void;
  
  // Real-time Updates
  handleMessageCreated: (directMessageId: string, message: Message) => void;
  handleMessageUpdated: (directMessageId: string, message: Message) => void;
  handleMessageDeleted: (directMessageId: string, messageId: string) => void;
  
  // Cleanup
  // clearMessages: (directMessageId: string) => void;
}

export interface TemplateStore {
  // Data
  templates: Template[];

  // UI States
  isLoading: boolean;
  error: string | null;

  // Fetch Actions
  fetchTemplates: () => Promise<void>;
  fetchTemplateById: (id: string) => Promise<void>;
  fetchTemplatesByUser: (userId: string) => Promise<void>;
  fetchTemplatesBySearch: (searchQuery: string) => Promise<void>;

  // Mutations
  createTemplate: (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;

  // State Updates
  setTemplates: (templates: Template[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Real-time Updates
  handleTemplateCreated: (template: Template) => void;
  handleTemplateUpdated: (template: Template) => void;
  handleTemplateDeleted: (id: string) => void;
}

export interface KnowledgeBaseState {
  articles: KnowledgeBaseArticle[]
  isLoading: boolean
  error: string | null
  fetchArticles: () => Promise<void>
  uploadArticle: (file: File, metadata: ArticleMetadata) => Promise<void>
  deleteArticle: (path: string) => Promise<void>
  downloadArticle: (path: string) => Promise<Blob>
}