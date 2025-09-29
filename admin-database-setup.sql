-- =====================================================
-- Admin Role System Setup
-- =====================================================
-- Run this in your Supabase SQL Editor to add admin functionality

-- Add role column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));

-- Create admin-specific RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.users 
      WHERE role IN ('admin', 'super_admin')
    )
  );

-- Super admins can update any user
CREATE POLICY "Super admins can update any user" ON public.users
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.users 
      WHERE role = 'super_admin'
    )
  );

-- Super admins can delete users (optional)
CREATE POLICY "Super admins can delete users" ON public.users
  FOR DELETE USING (
    auth.uid() IN (
      SELECT id FROM public.users 
      WHERE role = 'super_admin'
    )
  );

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- =====================================================
-- ADMIN USER CREATION
-- =====================================================
-- Uncomment and modify to create your first admin user
-- Replace 'your-email@example.com' with your actual email

-- UPDATE public.users 
-- SET role = 'super_admin' 
-- WHERE email = 'your-email@example.com';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the admin system is working

-- Check if role column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'role';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'users';

-- Check users with admin roles
SELECT id, email, role, created_at 
FROM public.users 
WHERE role IN ('admin', 'super_admin')
ORDER BY created_at DESC;
