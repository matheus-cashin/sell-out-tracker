-- Remove all RLS policies and disable RLS on all tables
-- WARNING: This makes all data publicly accessible without any authentication

-- Disable RLS on all tables
ALTER TABLE public.stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can manage stores" ON public.stores;
DROP POLICY IF EXISTS "Stores are viewable by everyone" ON public.stores;

DROP POLICY IF EXISTS "Admins can manage vendors" ON public.vendors;

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Everyone can view active products" ON public.products;

DROP POLICY IF EXISTS "Admins can create receipts" ON public.receipts;
DROP POLICY IF EXISTS "Admins can validate receipts" ON public.receipts;
DROP POLICY IF EXISTS "Admins can view all receipts" ON public.receipts;

DROP POLICY IF EXISTS "Admins can manage receipt products" ON public.receipt_products;

DROP POLICY IF EXISTS "Admins can delete permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Admins can insert permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Admins can update permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Admins can view all permissions" ON public.admin_permissions;

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;