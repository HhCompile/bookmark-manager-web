import { useComplianceStore } from '../store/complianceStore';
import { Button } from '../components/ui/button';
import { apiService } from '../services/api';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface CreateTodoFormProps {
  onFileCreated?: (filePath: string) => void;
}

const CreateTodoForm: React.FC<CreateTodoFormProps> = ({ onFileCreated }) => {
  const { todoFilePath, setTodoFilePath } = useComplianceStore();
  const [overwrite, setOverwrite] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      const response = await apiService.createTodoMd({
        filePath: todoFilePath,
        overwrite: overwrite,
      });

      if (response.status === 201) {
        toast.success('TODO.md file created successfully!');
        if (onFileCreated) {
          onFileCreated(todoFilePath);
        }
      } else {
        setError('Failed to create TODO.md file');
        toast.error('Failed to create TODO.md file');
      }
    } catch (err: any) {
      setError(
        err.message || 'An error occurred while creating the TODO.md file'
      );
      toast.error(
        err.message || 'An error occurred while creating the TODO.md file'
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="filePath"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          File Path
        </label>
        <input
          type="text"
          id="filePath"
          value={todoFilePath}
          onChange={e => setTodoFilePath(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., TODO.md or docs/TODO.md"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Specify where to create the TODO.md file
        </p>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={overwrite}
            onChange={e => setOverwrite(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Overwrite if file exists
          </span>
        </label>
      </div>

      <Button type="submit" disabled={isCreating} className="w-full">
        {isCreating ? 'Creating...' : 'Create TODO.md'}
      </Button>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          Error: {error}
        </div>
      )}
    </form>
  );
};

export default CreateTodoForm;
