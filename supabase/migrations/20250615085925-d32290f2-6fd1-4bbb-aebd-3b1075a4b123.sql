
-- Create projects table
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

-- Add RLS to projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies for projects table
CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public projects are viewable by everyone" ON public.projects FOR SELECT USING (is_public = true);

-- Create project_versions table
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

-- Add RLS to project_versions table
ALTER TABLE public.project_versions ENABLE ROW LEVEL SECURITY;

-- Policies for project_versions table
CREATE POLICY "Users can manage versions for their own projects" ON public.project_versions FOR ALL
USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_versions.project_id AND projects.user_id = auth.uid()));

