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

-- Optional: Enable RLS on tables (you must then create policies in Supabase to enforce row-level security)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
-- ... etc.