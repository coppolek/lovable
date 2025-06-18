/*
  # Projects and Project Versions Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, not null)
      - `description` (text, nullable)
      - `code` (text, default empty string)
      - `is_public` (boolean, default false)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)
    - `project_versions`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `version_number` (integer, not null)
      - `title` (text, not null)
      - `code` (text, not null)
      - `created_at` (timestamptz, default now)
      - `created_by` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
    - Public projects viewable by everyone
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
    CONSTRAINT projects_pkey PRIMARY KEY (id)
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'projects_user_id_fkey' 
        AND table_name = 'projects'
    ) THEN
        ALTER TABLE public.projects 
        ADD CONSTRAINT projects_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS on projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public.projects;

-- Create policies for projects table
CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (is_public = true);

-- Create project_versions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.project_versions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    version_number int4 NOT NULL,
    title text NOT NULL,
    code text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NOT NULL,
    CONSTRAINT project_versions_pkey PRIMARY KEY (id)
);

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'project_versions_created_by_fkey' 
        AND table_name = 'project_versions'
    ) THEN
        ALTER TABLE public.project_versions 
        ADD CONSTRAINT project_versions_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'project_versions_project_id_fkey' 
        AND table_name = 'project_versions'
    ) THEN
        ALTER TABLE public.project_versions 
        ADD CONSTRAINT project_versions_project_id_fkey 
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS on project_versions table
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and recreate it
DROP POLICY IF EXISTS "Users can manage versions for their own projects" ON public.project_versions;

-- Create policy for project_versions table
CREATE POLICY "Users can manage versions for their own projects" ON public.project_versions FOR ALL
USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_versions.project_id AND projects.user_id = auth.uid()));