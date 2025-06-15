
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

  return {
    ...currentHook,
    projects: transformedProjects,
    provider,
  };
};
