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
  MessagesStore,
  UsersStore,
  TemplateStore,
  KnowledgeBaseStore,
  DashboardStore
} from '@/types/store';
import { supabase } from '@/lib/supabase';
import { ArticleMetadata, TicketStatus } from '@/types/schema';
import { downloadArticle, listArticles, uploadArticle, deleteArticle, getArticleUrl } from '@/lib/storage';

export const useUsersStore = create<UsersStore>((set) => ({
  // Initial State
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  // Fetch Actions
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('users')
        .select()
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ users: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch users' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ selectedUser: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch user' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUsersByRole: async (role) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('role', role)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ users: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch users' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUsersBySearch: async (searchQuery) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('users')
        .select()
        .textSearch('email', searchQuery, { type: 'websearch' })
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ users: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch users' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Mutations
  updateUser: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update user' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete user' });
    } finally {
      set({ isLoading: false });
    }
  },

  // State Updates
  setSelectedUser: (user) => set({ selectedUser: user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Real-time Updates
  handleUserUpdated: (user) => {
    set((state) => ({
      users: state.users.map(u => u.id === user.id ? user : u),
      selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser
    }));
  },

  handleUserDeleted: (id) => {
    set((state) => ({
      users: state.users.filter(u => u.id !== id),
      selectedUser: state.selectedUser?.id === id ? null : state.selectedUser
    }));
  }
}));

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

// Helper function to get date range based on time period
const getDateRangeFromTimePeriod = (period: 'day' | 'week' | 'month' | 'year'): { startDate: Date, endDate: Date } => {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }
  
  return { startDate, endDate };
};

// Type guard for ticket status
const isValidTicketStatus = (status: any): status is TicketStatus => {
  return status === 'open' || status === 'pending' || status === 'resolved';
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Initial State for Dashboard
  ticketsByStatus: {
    open: 0,
    pending: 0,
    resolved: 0
  },
  ticketsResolvedByDate: [],
  ticketsOpenedByDate: [],
  timePeriod: 'month',
  isLoading: false,
  error: null,

  // Fetch Dashboard Data
  fetchDashboardData: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current time period filter
      const { timePeriod } = get();
      
      // 1. Fetch tickets for status counts
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('id, status, created_at, updated_at');
      
      if (ticketsError) throw ticketsError;
      
      // Process tickets by status
      const statusCounts = {
        open: 0,
        pending: 0,
        resolved: 0
      };
      
      tickets.forEach(ticket => {
        if (isValidTicketStatus(ticket.status)) {
          statusCounts[ticket.status] += 1;
        }
      });
      
      // 2. Fetch audit logs for resolved and opened tickets
      const { data: auditLogs, error: auditLogsError } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', 'tickets')
        .order('changed_at', { ascending: false });
      
      if (auditLogsError) throw auditLogsError;
      
      // Process audit logs for ticket status changes
      const resolvedByDate: Record<string, number> = {};
      const openedByDate: Record<string, number> = {};
      
      // Get date range based on time period
      const dateRange = getDateRangeFromTimePeriod(timePeriod);
      
      // Process resolved tickets from audit logs
      auditLogs.forEach(log => {
        // Skip if null data
        if (!log.old_data || !log.new_data) return;
        
        try {
          const oldData = typeof log.old_data === 'string' ? JSON.parse(log.old_data) : log.old_data;
          const newData = typeof log.new_data === 'string' ? JSON.parse(log.new_data) : log.new_data;
          
          const logDate = new Date(log.changed_at).toISOString().split('T')[0];
          
          // If within date range
          if (new Date(logDate) >= dateRange.startDate && new Date(logDate) <= dateRange.endDate) {
            // Count resolved tickets
            if (log.operation === 'UPDATE' && oldData.status !== 'resolved' && newData.status === 'resolved') {
              resolvedByDate[logDate] = (resolvedByDate[logDate] || 0) + 1;
            }
            
            // Count created tickets
            if (log.operation === 'INSERT') {
              openedByDate[logDate] = (openedByDate[logDate] || 0) + 1;
            }
          }
        } catch (e) {
          console.error('Error processing audit log:', e);
        }
      });
      
      // Convert records to arrays for graphing
      const resolvedTicketsByDate = Object.entries(resolvedByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      const openedTicketsByDate = Object.entries(openedByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      // Update state with the fetched data
      set({
        ticketsByStatus: statusCounts,
        ticketsResolvedByDate: resolvedTicketsByDate,
        ticketsOpenedByDate: openedTicketsByDate,
        isLoading: false
      });
      
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to fetch dashboard data',
        isLoading: false 
      });
    }
  },
  
  // Set time period for filtering
  setTimePeriod: (period) => {
    set({ timePeriod: period });
    get().fetchDashboardData(); // Reload data with new period
  },
  
  // State Updates
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // Real-time Updates
  handleTicketCreated: (ticket) => {
    // Update tickets by status count
    if (isValidTicketStatus(ticket.status)) {
      set((state) => ({
        ticketsByStatus: {
          ...state.ticketsByStatus,
          [ticket.status]: state.ticketsByStatus[ticket.status] + 1
        }
      }));
    }
    
    // Add to opened tickets if today
    const today = new Date().toISOString().split('T')[0];
    set((state) => {
      const existingOpened = [...state.ticketsOpenedByDate];
      const todayIndex = existingOpened.findIndex(item => item.date === today);
      
      if (todayIndex >= 0) {
        existingOpened[todayIndex] = { 
          ...existingOpened[todayIndex], 
          count: existingOpened[todayIndex].count + 1 
        };
      } else {
        existingOpened.push({ date: today, count: 1 });
      }
      
      return { ticketsOpenedByDate: existingOpened };
    });
  },
  
  handleTicketUpdated: (ticket, oldTicket) => {
    // If status changed, update counts
    if (ticket.status !== oldTicket.status) {
      const validOldStatus = isValidTicketStatus(oldTicket.status);
      const validNewStatus = isValidTicketStatus(ticket.status);
      
      if (validOldStatus && validNewStatus) {
        set((state) => ({
          ticketsByStatus: {
            ...state.ticketsByStatus,
            [oldTicket.status]: Math.max(0, state.ticketsByStatus[oldTicket.status] - 1),
            [ticket.status]: state.ticketsByStatus[ticket.status] + 1
          }
        }));
      } else if (validOldStatus) {
        set((state) => ({
          ticketsByStatus: {
            ...state.ticketsByStatus,
            [oldTicket.status]: Math.max(0, state.ticketsByStatus[oldTicket.status] - 1)
          }
        }));
      } else if (validNewStatus) {
        set((state) => ({
          ticketsByStatus: {
            ...state.ticketsByStatus,
            [ticket.status]: state.ticketsByStatus[ticket.status] + 1
          }
        }));
      }
      
      // If resolved, add to resolved tickets
      if (ticket.status === 'resolved' && oldTicket.status !== 'resolved') {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const existingResolved = [...state.ticketsResolvedByDate];
          const todayIndex = existingResolved.findIndex(item => item.date === today);
          
          if (todayIndex >= 0) {
            existingResolved[todayIndex] = { 
              ...existingResolved[todayIndex], 
              count: existingResolved[todayIndex].count + 1 
            };
          } else {
            existingResolved.push({ date: today, count: 1 });
          }
          
          return { ticketsResolvedByDate: existingResolved };
        });
      }
    }
  },
  
  handleTicketDeleted: (ticket) => {
    // Update counts
    if (isValidTicketStatus(ticket.status)) {
      set((state) => ({
        ticketsByStatus: {
          ...state.ticketsByStatus,
          [ticket.status]: Math.max(0, state.ticketsByStatus[ticket.status] - 1)
        }
      }));
    }
  },
  
  // Analytics Helpers
  getTicketTrends: () => {
    const { ticketsOpenedByDate, ticketsResolvedByDate } = get();
    
    // Calculate open rate (tickets opened per day in the period)
    const totalOpened = ticketsOpenedByDate.reduce((sum, item) => sum + item.count, 0);
    const daysInPeriod = ticketsOpenedByDate.length || 1; // Avoid division by zero
    const openRate = totalOpened / daysInPeriod;
    
    // Calculate resolve rate (tickets resolved per day in the period)
    const totalResolved = ticketsResolvedByDate.reduce((sum, item) => sum + item.count, 0);
    const resolveRate = totalResolved / daysInPeriod;
    
    // Calculate average resolution time (simple approximation based on available data)
    // In a real system, this would need more precise ticket-level data
    const averageResolutionTime = totalOpened > 0 ? (totalResolved / totalOpened) * 24 : 0; // in hours
    
    return {
      openRate,
      resolveRate,
      averageResolutionTime
    };
  }
}));

export const useDirectMessageStore = create<DirectMessageStore>((set, get) => ({
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
          recipient:recipient_id(id, email)
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
          recipient:recipient_id(id, email)
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
          recipient:recipient_id(id, email)
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

  // Utility
  isSelectedDirectMessageAIAgent: () => {
    const { selectedDirectMessage } = get();
    if (!selectedDirectMessage) return false;

    if (selectedDirectMessage.recipient_id === '2c5dea55-3904-4aef-9439-048a4df68fba') {
      return true;
    }
    return false;
  },

  // Real-time Updates
  handleDirectMessageCreated: async (directMessage) => {
    const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:sender_id(id, email),
          recipient:recipient_id(id, email)
        `)
        .eq('id', directMessage.id)
        .single();

    if (error) throw error;

    set((state) => ({
      directMessages: [{...directMessage, sender: data.sender, recipient: data.recipient}, ...state.directMessages]
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
}));

export const useTemplateStore = create<TemplateStore>((set) => ({
  // Initial State
  templates: [],
  isLoading: false,
  error: null,

  // Fetch Actions
  fetchTemplates: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ templates: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch templates' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTemplateById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ templates: [data] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch template' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTemplatesByUser: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ templates: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch templates' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTemplatesBySearch: async (searchQuery) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('templates')
        .select(`
          *
        `)
        .textSearch('name', searchQuery, { type: 'websearch' })
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ templates: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch templates' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Mutations
  createTemplate: async (template) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create template' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTemplate: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update template' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTemplate: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Real-time will handle state update
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete template' });
    } finally {
      set({ isLoading: false });
    }
  },

  // State Updates
  setTemplates: (templates) => set({ templates }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Real-time Updates
  handleTemplateCreated: (template) => {
    set((state) => ({
      templates: [template, ...state.templates]
    }));
  },

  handleTemplateUpdated: (template) => {
    set((state) => ({
      templates: state.templates.map(t => t.id === template.id ? template : t)
    }));
  },

  handleTemplateDeleted: (id) => {
    set((state) => ({
      templates: state.templates.filter(t => t.id !== id)
    }));
  }
}));

export const useKnowledgeBaseStore = create<KnowledgeBaseStore>((set, get) => ({
  articles: [],
  isLoading: false,
  error: null,

  fetchArticles: async () => {
    try {
      set({ isLoading: true, error: null })
      const articles = await listArticles()
      set({
        articles: articles.map(article => ({
          ...article,
          path: article.name,
          size: 0,
          metadata: {
            title: article.metadata?.title || article.name,
            published: article.metadata?.published ?? false,
            description: article.metadata?.description,
            category: article.metadata?.category,
            tags: article.metadata?.tags || [],
            author: article.metadata?.author,
            version: article.metadata?.version
          },
          url: getArticleUrl(article.name)
        })),
        isLoading: false
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch articles', isLoading: false })
    }
  },

  uploadArticle: async (file: File, metadata: Partial<ArticleMetadata>) => {
    try {
      set({ isLoading: true, error: null })
      const result = await uploadArticle(file, metadata)
      if (result) {
        const articles = await listArticles()
        set({
          articles: articles.map(article => ({
            ...article,
            path: article.name,
            size: 0,
            metadata: {
              title: article.metadata?.title || article.name,
              published: article.metadata?.published ?? false,
              description: article.metadata?.description,
              category: article.metadata?.category,
              tags: article.metadata?.tags || [],
              author: article.metadata?.author,
              version: article.metadata?.version
            },
            url: getArticleUrl(article.name)
          })),
          isLoading: false
        })
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to upload article', isLoading: false })
    }
  },

  deleteArticle: async (path: string) => {
    try {
      set({ isLoading: true, error: null })
      await deleteArticle(path)
      const articles = get().articles.filter(article => article.path !== path)
      set({ articles, isLoading: false })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete article', isLoading: false })
    }
  },

  downloadArticle: async (path: string) => {
    try {
      set({ isLoading: true, error: null })
      const blob = await downloadArticle(path)
      set({ isLoading: false })
      return blob
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to download article', isLoading: false })
      throw error
    }
  }
}))
