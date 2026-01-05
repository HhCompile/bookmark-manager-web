import { devtools } from 'zustand/middleware';
import { create } from 'zustand';

interface ComplianceState {
  // File operation states
  isCreatingTodo: boolean;
  isUpdatingTasks: boolean;
  isVerifyingCompliance: boolean;

  // File paths
  todoFilePath: string;
  tasksFilePath: string;

  // Compliance status
  todoExists: boolean;
  todoValid: boolean;
  tasksHasCoverage: boolean;
  isCompliant: boolean;

  // Error states
  error: string | null;

  // Actions
  setTodoFilePath: (path: string) => void;
  setTasksFilePath: (path: string) => void;
  setCreatingTodo: (isCreating: boolean) => void;
  setUpdatingTasks: (isUpdating: boolean) => void;
  setVerifyingCompliance: (isVerifying: boolean) => void;
  setComplianceStatus: (status: {
    todoExists?: boolean;
    todoValid?: boolean;
    tasksHasCoverage?: boolean;
    isCompliant?: boolean;
  }) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useComplianceStore = create<ComplianceState>()(
  devtools(set => ({
    // Initial states
    isCreatingTodo: false,
    isUpdatingTasks: false,
    isVerifyingCompliance: false,
    todoFilePath: 'TODO.md',
    tasksFilePath: 'tasks.md',
    todoExists: false,
    todoValid: false,
    tasksHasCoverage: false,
    isCompliant: false,
    error: null,

    // Actions
    setTodoFilePath: path => set({ todoFilePath: path }),
    setTasksFilePath: path => set({ tasksFilePath: path }),
    setCreatingTodo: isCreating => set({ isCreatingTodo: isCreating }),
    setUpdatingTasks: isUpdating => set({ isUpdatingTasks: isUpdating }),
    setVerifyingCompliance: isVerifying =>
      set({ isVerifyingCompliance: isVerifying }),
    setComplianceStatus: status =>
      set(state => ({
        ...state,
        ...status,
      })),
    setError: error => set({ error }),
    clearError: () => set({ error: null }),
  }))
);
