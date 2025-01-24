import { create } from 'zustand';
import {
  AuthState,
  TicketStore,
  UIState,
  TagsState,
  NotesStore,
  CustomFieldsState,
  CommentsState,
  SearchState,
  AuditStore,
  DirectMessageStore,
  MessagesStore
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

export const useTicketStore = create<TicketStore>((set) => ({
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

  fetchTicketsBySearch: async (searchQuery) => {
    try {
        set({ isLoading: true, error: null });
        
        const { data, error } = await supabase
          .from('tickets')
          .select()
          .textSearch('title', searchQuery, { type: 'websearch' })
          .order('created_at', { ascending: false });
  
        if (error) throw error;
        set({ tickets: data });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Failed to fetch tickets' });
      } finally {
        set({ isLoading: false });
      }
  },

  // Mutations
  createTicket: async (ticket) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
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
      
      const { error } = await supabase
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

export const useNotesStore = create<NotesStore>((set) => ({
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
      
      const { error } = await supabase
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
      
      const { error } = await supabase
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

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));

export const useAuditStore = create<AuditStore>((set, get) => ({
  // Initial State
  auditLogs: [],
  isLoading: false,
  error: null,

  // Fetch Actions
  fetchAuditLogs: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*, user:users(email)')
        .order('changed_at', { ascending: false });

      if (error) throw error;
      set({ auditLogs: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch audit logs' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAuditLogsByTable: async (tableName: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*, user:users(email)')
        .eq('table_name', tableName)
        .order('changed_at', { ascending: false });

      if (error) throw error;
      set({ auditLogs: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch audit logs' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAuditLogsByUser: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*, user:users(email)')
        .eq('changed_by', userId)
        .order('changed_at', { ascending: false });

      if (error) throw error;
      set({ auditLogs: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch audit logs' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAuditLogsBySearch: async (searchQuery: string) => {
    try {
      set({ isLoading: true, error: null });
      // Implement search logic here
      const { data, error } = await supabase
          .from('audit_logs')
          .select()
          .textSearch('operation', searchQuery, { type: 'websearch' })
          .order('changed_at', { ascending: false });

      if (error) throw error;
      set({ auditLogs: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch audit logs' });
    } finally {
      set({ isLoading: false });
    }
  },

  // State Updates
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Real-time Updates
  handleAuditLogCreated: (log) => {
    set((state) => ({
      auditLogs: [log, ...state.auditLogs]
    }));
  },

  // Analytics
  getOperationCounts: () => {
    const { auditLogs } = get();
    return auditLogs.reduce((acc, log) => {
      acc[log.operation] = (acc[log.operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  getTableActivityCounts: () => {
    const { auditLogs } = get();
    return auditLogs.reduce((acc, log) => {
      acc[log.table_name] = (acc[log.table_name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  getUserActivityCounts: () => {
    const { auditLogs } = get();
    return auditLogs.reduce((acc, log) => {
      if (log.changed_by) {
        acc[log.changed_by] = (acc[log.changed_by] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  },

  getActivityTimeline: () => {
    const { auditLogs } = get();
    const timeline: Record<string, number> = {};
    
    auditLogs.forEach(log => {
      const date = new Date(log.changed_at).toISOString().split('T')[0];
      timeline[date] = (timeline[date] || 0) + 1;
    });

    return Object.entries(timeline)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
}));

export const useDirectMessageStore = create<DirectMessageStore>((set) => ({
  // Initial State
  directMessages: [],
  selectedDirectMessage: null,
  isLoading: false,
  error: null,

  // Fetch Actions
  fetchDirectMessages: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:sender_id(id, email),
          recipient:recipient_id(id, email),
          messages(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ directMessages: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch direct messages' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDirectMessageById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:sender_id(id, email),
          recipient:recipient_id(id, email),
          messages(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ selectedDirectMessage: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch direct message' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDirectMessagesByUser: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:sender_id(id, email),
          recipient:recipient_id(id, email),
          messages(*)
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ directMessages: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch direct messages' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Mutations
  createDirectMessage: async (directMessage) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('direct_messages')
        .insert(directMessage)
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create direct message' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateDirectMessage: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('direct_messages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update direct message' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDirectMessage: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('direct_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete direct message' });
    } finally {
      set({ isLoading: false });
    }
  },

  // State Updates
  setSelectedDirectMessage: (directMessage) => set({ selectedDirectMessage: directMessage }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Real-time Updates
  handleDirectMessageCreated: (directMessage) => {
    set((state) => ({
      directMessages: [directMessage, ...state.directMessages]
    }));
  },

  handleDirectMessageUpdated: (directMessage) => {
    set((state) => ({
      directMessages: state.directMessages.map(dm => dm.id === directMessage.id ? directMessage : dm),
      selectedDirectMessage: state.selectedDirectMessage?.id === directMessage.id ? directMessage : state.selectedDirectMessage
    }));
  },

  handleDirectMessageDeleted: (id) => {
    set((state) => ({
      directMessages: state.directMessages.filter(dm => dm.id !== id),
      selectedDirectMessage: state.selectedDirectMessage?.id === id ? null : state.selectedDirectMessage
    }));
  }
}));

export const useMessagesStore = create<MessagesStore>((set) => ({
  // Initial State
  messages: {},
  isLoading: {},
  error: {},

  // Fetch Actions
  fetchMessages: async (directMessageId) => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, [directMessageId]: true },
        error: { ...state.error, [directMessageId]: null }
      }));
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, email)
        `)
        .eq('direct_message_id', directMessageId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      set((state) => ({
        messages: { ...state.messages, [directMessageId]: data || [] }
      }));
    } catch (err) {
      set((state) => ({
        error: { 
          ...state.error, 
          [directMessageId]: err instanceof Error ? err.message : 'Failed to fetch messages' 
        }
      }));
    } finally {
      set((state) => ({
        isLoading: { ...state.isLoading, [directMessageId]: false }
      }));
    }
  },

  // Mutations
  createMessage: async (directMessageId, message) => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, [directMessageId]: true },
        error: { ...state.error, [directMessageId]: null }
      }));
      
      const { error } = await supabase
        .from('messages')
        .insert({ ...message, direct_message_id: directMessageId })
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set((state) => ({
        error: { 
          ...state.error, 
          [directMessageId]: err instanceof Error ? err.message : 'Failed to create message' 
        }
      }));
    } finally {
      set((state) => ({
        isLoading: { ...state.isLoading, [directMessageId]: false }
      }));
    }
  },

  updateMessage: async (directMessageId, messageId, updates) => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, [directMessageId]: true },
        error: { ...state.error, [directMessageId]: null }
      }));
      
      const { error } = await supabase
        .from('messages')
        .update(updates)
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set((state) => ({
        error: { 
          ...state.error, 
          [directMessageId]: err instanceof Error ? err.message : 'Failed to update message' 
        }
      }));
    } finally {
      set((state) => ({
        isLoading: { ...state.isLoading, [directMessageId]: false }
      }));
    }
  },

  deleteMessage: async (directMessageId, messageId) => {
    try {
      set((state) => ({
        isLoading: { ...state.isLoading, [directMessageId]: true },
        error: { ...state.error, [directMessageId]: null }
      }));
      
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set((state) => ({
        error: { 
          ...state.error, 
          [directMessageId]: err instanceof Error ? err.message : 'Failed to delete message' 
        }
      }));
    } finally {
      set((state) => ({
        isLoading: { ...state.isLoading, [directMessageId]: false }
      }));
    }
  },

  // State Updates
  setLoading: (directMessageId, isLoading) => 
    set((state) => ({
      isLoading: { ...state.isLoading, [directMessageId]: isLoading }
    })),

  setError: (directMessageId, error) => 
    set((state) => ({
      error: { ...state.error, [directMessageId]: error }
    })),

  // Real-time Updates
  handleMessageCreated: (directMessageId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [directMessageId]: [...(state.messages[directMessageId] || []), message]
      }
    }));
  },

  handleMessageUpdated: (directMessageId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [directMessageId]: (state.messages[directMessageId] || []).map(m => 
          m.id === message.id ? message : m
        )
      }
    }));
  },

  handleMessageDeleted: (directMessageId, messageId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [directMessageId]: (state.messages[directMessageId] || []).filter(m => 
          m.id !== messageId
        )
      }
    }));
  },

  // Cleanup
  // clearMessages: (directMessageId) => {
  //   set((state) => {
  //     const { 
  //       [directMessageId]: _, 
  //       ...remainingMessages 
  //     } = state.messages;
      
  //     const {
  //       [directMessageId]: __,
  //       ...remainingLoading
  //     } = state.isLoading;
      
  //     const {
  //       [directMessageId]: ___,
  //       ...remainingErrors
  //     } = state.error;

  //     return {
  //       messages: remainingMessages,
  //       isLoading: remainingLoading,
  //       error: remainingErrors
  //     };
  //   });
  // }
}));