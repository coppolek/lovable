
import { useDatabaseConfig } from './useDatabaseConfig';
import { useProjects as useFirebaseProjects } from './useProjects';
import { useSupabaseProjects } from './useSupabaseProjects';

// Unified project interface
export interface UnifiedProject {
  id: string;
  name: string;
  description?: string;
  created_at: string | Date;
  updated_at: string | Date;
  code: string;
  is_public: boolean;
  user_id: string;
  provider: 'firebase' | 'supabase';
}

export const useUnifiedProjects = () => {
  const { provider } = useDatabaseConfig();
  const firebaseHook = useFirebaseProjects();
  const supabaseHook = useSupabaseProjects();

  const currentHook = provider === 'firebase' ? firebaseHook : supabaseHook;

  // Transform projects to unified format
  const transformedProjects: UnifiedProject[] = currentHook.projects.map(project => ({
    ...project,
    created_at: provider === 'firebase' 
      ? (project as any).created_at?.toDate?.() || project.created_at
      : project.created_at,
    updated_at: provider === 'firebase' 
      ? (project as any).updated_at?.toDate?.() || project.updated_at
      : project.updated_at,
    provider
  }));

  // Wrapper functions to ensure returned projects have provider property
  const createProject = async (name: string, description?: string) => {
    const newProject = await currentHook.createProject(name, description);
    return {
      ...newProject,
      created_at: provider === 'firebase' 
        ? (newProject as any).created_at?.toDate?.() || newProject.created_at
        : newProject.created_at,
      updated_at: provider === 'firebase' 
        ? (newProject as any).updated_at?.toDate?.() || newProject.updated_at
        : newProject.updated_at,
      provider
    } as UnifiedProject;
  };

  const updateProject = async (id: string, updates: Partial<Omit<UnifiedProject, 'id' | 'created_at' | 'user_id' | 'provider'>>) => {
    // Remove provider from updates since it shouldn't be updated
    const { provider: _, ...cleanUpdates } = updates as any;
    return currentHook.updateProject(id, cleanUpdates);
  };

  return {
    ...currentHook,
    projects: transformedProjects,
    provider,
    createProject,
    updateProject,
  };
};
