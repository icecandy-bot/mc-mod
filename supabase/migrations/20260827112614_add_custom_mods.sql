/*
# Add custom_mods column to recommendations

1. Modified Tables
- `recommendations`
  - Add `custom_mods` (text[], default '{}') — stores user-typed mod names that aren't in the predefined list.

2. Security
- No policy changes needed; existing RLS policies already cover the table.
*/

ALTER TABLE recommendations
  ADD COLUMN IF NOT EXISTS custom_mods text[] NOT NULL DEFAULT '{}';
