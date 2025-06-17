/*
  # Fix migration for projects and project_versions tables

  1. Tables to create/update
    - `projects` - User projects with code and metadata
    - `project_versions` - Version history for projects

  2. Security
    - Enable RLS on both tables
    - Add policies for user access control
    - Ensure proper foreign key relationships

  3. Changes
    - Use IF NOT EXISTS to avoid conflicts
    - Proper error handling for existing tables
    - Maintain all original functionality
*/

-- Create projects table only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        CREATE TABLE public.projects (
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
    END IF;
END $$;

-- Enable RLS on projects table if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'projects' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies for projects table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can manage their own projects'
    ) THEN
        CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Public projects are viewable by everyone'
    ) THEN
        CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (is_public = true);
    END IF;
END $$;

-- Create project_versions table only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_versions') THEN
        CREATE TABLE public.project_versions (
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
    END IF;
END $$;

-- Enable RLS on project_versions table if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'project_versions' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies for project_versions table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'project_versions' AND policyname = 'Users can manage versions for their own projects'
    ) THEN
        CREATE POLICY "Users can manage versions for their own projects" ON public.project_versions FOR ALL
        USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_versions.project_id AND projects.user_id = auth.uid()));
    END IF;
END $$;