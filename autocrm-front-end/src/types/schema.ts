// Enum Types
export type UserRole = 'customer' | 'employee' | 'admin';
export type TicketStatus = 'open' | 'pending' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high';
export type CustomFieldType = 'text' | 'number' | 'date' | 'select';

// Base Types
export interface User {
  id: string; // UUID
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string; // UUID
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  customer_id: string; // UUID
  created_at: string;
  updated_at: string;
  // Relations
  customer?: User;
  tags?: Tag[];
  custom_fields?: TicketCustomField[];
  internal_notes?: InternalNote[];
  comments?: TicketComment[];
}

export interface Tag {
  id: string; // UUID
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CustomField {
  id: string; // UUID
  name: string;
  field_type: CustomFieldType;
  required: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketCustomField {
  id: string; // UUID
  ticket_id: string; // UUID
  custom_field_id: string; // UUID
  value: string;
  created_at: string;
  updated_at: string;
  // Relations
  custom_field?: CustomField;
}

export interface InternalNote {
  id: string; // UUID
  ticket_id: string; // UUID
  user_id: string; // UUID
  note_content: string;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
}

export interface TicketComment {
  id: string; // UUID
  ticket_id: string; // UUID
  user_id: string; // UUID
  comment_content: string;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
}

// Junction Types
export interface TicketTag {
  id: string; // UUID
  ticket_id: string; // UUID
  tag_id: string; // UUID
} 