/*
  # Fix migration for existing database

  1. Tables
    - Create projects table if not exists
    - Create project_versions table if not exists
  
  2. Security
    - Enable RLS on both tables
    - Add policies for proper access control
    
  3. Changes
    - Use IF NOT EXISTS to avoid conflicts
    - Use DO blocks for conditional operations
*/

-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text NULL,
    code text NOT NULL DEFAULT ''::text,
    is_public boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects table (drop if exists first)
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
    DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public.projects;
    
    -- Create new policies
    CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
    CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (is_public = true);
END $$;

-- Create project_versions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.project_versions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    version_number int4 NOT NULL,
    title text NOT NULL,
    code text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NOT NULL,
    CONSTRAINT project_versions_pkey PRIMARY KEY (id),
    CONSTRAINT project_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT project_versions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Enable RLS on project_versions table
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for project_versions table (drop if exists first)
DO $$
BEGIN
    -- Drop existing policy if it exists
    DROP POLICY IF EXISTS "Users can manage versions for their own projects" ON public.project_versions;
    
    -- Create new policy
    CREATE POLICY "Users can manage versions for their own projects" ON public.project_versions FOR ALL
    USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_versions.project_id AND projects.user_id = auth.uid()));
END $$;