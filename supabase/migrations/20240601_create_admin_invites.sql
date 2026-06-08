-- Create admin_invites table
CREATE TABLE IF NOT EXISTS admin_invites (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin_master', 'gestao_admin', 'admin_financeiro', 'admin_suporte')),
  permissions JSONB DEFAULT '[]'::jsonb,
  invite_token TEXT NOT NULL UNIQUE,
  invite_link TEXT NOT NULL,
  invited_by TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked', 'expired')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_invites_token ON admin_invites(invite_token);
CREATE INDEX IF NOT EXISTS idx_admin_invites_email ON admin_invites(email);
CREATE INDEX IF NOT EXISTS idx_admin_invites_status ON admin_invites(status);
CREATE INDEX IF NOT EXISTS idx_admin_invites_expires_at ON admin_invites(expires_at);

-- Enable Row Level Security
ALTER TABLE admin_invites ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_invites
-- Allow anyone to read invites by token (for accepting invites)
CREATE POLICY "Invites readable by token" ON admin_invites
  FOR SELECT
  USING (invite_token IS NOT NULL);

-- Allow admins to read all invites
CREATE POLICY "Admins can read all invites" ON admin_invites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.status = 'active'
    )
  );

-- Allow admins to create invites
CREATE POLICY "Admins can create invites" ON admin_invites
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.status = 'active'
    )
  );

-- Allow admins to update invites
CREATE POLICY "Admins can update invites" ON admin_invites
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.status = 'active'
    )
  );
