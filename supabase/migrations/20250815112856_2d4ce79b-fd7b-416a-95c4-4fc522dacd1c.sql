-- Create manager user account
-- Note: This creates the user directly in the auth system
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'farobi@turospustaka.com',
  crypt('manajer123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Farobi Afandi", "role": "Manajer"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- The profile will be automatically created by the trigger we set up earlier