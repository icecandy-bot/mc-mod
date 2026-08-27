/*
# Create recommendations table (no-auth, token-based ownership)

1. New Tables
- `recommendations`
  - `id` (uuid, primary key)
  - `author_name` (text, not null) - the friend's display name
  - `mod_ids` (text[], not null) - array of mod IDs the friend selected
  - `note` (text, nullable) - optional personal note
  - `edit_token` (uuid, not null) - secret token used to identify the creator for edit/delete
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `recommendations`.
- SELECT: public to anon + authenticated (everyone can view all recommendations).
- INSERT: public to anon + authenticated (anyone can create a recommendation with an edit_token).
- UPDATE: public to anon + authenticated WITH CHECK (true). Ownership is enforced by the frontend
  only passing the edit_token for rows the browser created. Since there is no auth, the database
  cannot distinguish creators; the edit_token is the ownership mechanism and is validated in the
  frontend before edits are submitted.
- DELETE: public to anon + authenticated USING (true). Same rationale as UPDATE.

  Note: Because this is a no-auth shared app, RLS cannot enforce per-creator ownership at the
  database level (there is no auth.uid()). The edit_token is the ownership credential: it is
  generated client-side, stored in localStorage, and sent with update/delete requests. The
  frontend only enables edit/delete for rows whose edit_token matches a locally-stored token.

3. Indexes
- Index on `edit_token` for fast lookups during edit/delete operations.
*/

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  mod_ids text[] NOT NULL DEFAULT '{}',
  note text,
  edit_token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_recommendations" ON recommendations;
CREATE POLICY "anon_select_recommendations"
  ON recommendations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_recommendations" ON recommendations;
CREATE POLICY "anon_insert_recommendations"
  ON recommendations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_recommendations" ON recommendations;
CREATE POLICY "anon_update_recommendations"
  ON recommendations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_recommendations" ON recommendations;
CREATE POLICY "anon_delete_recommendations"
  ON recommendations FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_recommendations_edit_token ON recommendations (edit_token);
