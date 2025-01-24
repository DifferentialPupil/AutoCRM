-- Create enums (optional) for role, ticket status, priority, and custom field type
-- You could use text + CHECK constraints instead, but using enum might be preferred for strict typing.

CREATE TYPE user_role AS ENUM ('customer', 'employee', 'admin');
CREATE TYPE ticket_status AS ENUM ('open', 'pending', 'resolved');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE custom_field_type AS ENUM ('text', 'number', 'date', 'select');

-- 1. users table
CREATE TABLE IF NOT EXISTS users (
  id               UUID NOT NULL PRIMARY KEY,
  email            VARCHAR(255) UNIQUE NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  role             user_role NOT NULL DEFAULT 'customer',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_users_auth
    FOREIGN KEY (id)
    REFERENCES auth.users (id)
    ON DELETE CASCADE
);

-- 2. tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id               UUID PRIMARY KEY UNIQUE,
  title            VARCHAR(255) NOT NULL,
  status           ticket_status NOT NULL DEFAULT 'open',
  priority         ticket_priority NOT NULL DEFAULT 'low',
  customer_id      UUID NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_tickets_customer
    FOREIGN KEY (customer_id)
    REFERENCES users (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- 3. tags table
CREATE TABLE IF NOT EXISTS tags (
  id               UUID PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ticket_tags table (junction for many-to-many between tickets and tags)
CREATE TABLE IF NOT EXISTS ticket_tags (
  id         UUID PRIMARY KEY,
  ticket_id  UUID NOT NULL,
  tag_id     UUID NOT NULL,
  CONSTRAINT fk_ticket_tags_ticket
    FOREIGN KEY (ticket_id)
    REFERENCES tickets (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_ticket_tags_tag
    FOREIGN KEY (tag_id)
    REFERENCES tags (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT unique_ticket_tag_combination
    UNIQUE (ticket_id, tag_id)
);

-- 5. custom_fields table
CREATE TABLE IF NOT EXISTS custom_fields (
  id               UUID PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  field_type       custom_field_type NOT NULL,
  required         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ticket_custom_fields table
CREATE TABLE IF NOT EXISTS ticket_custom_fields (
  id                UUID PRIMARY KEY,
  ticket_id         UUID NOT NULL,
  custom_field_id   UUID NOT NULL,
  value             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_ticket_customfields_ticket
    FOREIGN KEY (ticket_id)
    REFERENCES tickets (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_ticket_customfields_field
    FOREIGN KEY (custom_field_id)
    REFERENCES custom_fields (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  -- Enforce ticket_id + custom_field_id uniqueness if each ticket can only have one value of each custom field
  CONSTRAINT unique_ticket_custom_field
    UNIQUE (ticket_id, custom_field_id)
);

-- 7. internal_notes table
CREATE TABLE IF NOT EXISTS internal_notes (
  id               UUID PRIMARY KEY,
  ticket_id        UUID NOT NULL,
  user_id          UUID NOT NULL,
  note_content     TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_internal_notes_ticket
    FOREIGN KEY (ticket_id)
    REFERENCES tickets (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_internal_notes_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- 8. ticket_comments table
CREATE TABLE IF NOT EXISTS ticket_comments (
  id               UUID PRIMARY KEY,
  ticket_id        UUID NOT NULL,
  user_id          UUID NOT NULL,
  comment_content  TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_ticket_comments_ticket
    FOREIGN KEY (ticket_id)
    REFERENCES tickets (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_ticket_comments_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id               UUID NOT NULL DEFAULT gen_random_uuid(),
  table_name       TEXT NOT NULL,
  operation        TEXT NOT NULL,
  old_data         JSONB NULL,
  new_data         JSONB NULL,
  changed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by       UUID NULL,
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS direct_messages (
  id               UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sender_id        UUID NOT NULL,
  recipient_id     UUID NOT NULL,
  CONSTRAINT direct_messages_pkey PRIMARY KEY (id),
  CONSTRAINT direct_messages_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES users(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT direct_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS messages (
  id               UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sender_id        UUID NOT NULL,
  channel_id       UUID NULL,
  direct_message_id UUID NULL,
  content          TEXT NOT NULL,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES channels(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT messages_direct_message_id_fkey FOREIGN KEY (direct_message_id) REFERENCES direct_messages(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS channels (
  id               UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name             TEXT NOT NULL,
  user_id          UUID NOT NULL,
  CONSTRAINT channel_pkey PRIMARY KEY (id),
  CONSTRAINT channel_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS templates (
  id               UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL,
  name             TEXT NOT NULL,
  content          TEXT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT template_pkey PRIMARY KEY (id),
  CONSTRAINT template_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

-- Optional: Enable RLS on tables (you must then create policies in Supabase to enforce row-level security)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
-- ... etc.