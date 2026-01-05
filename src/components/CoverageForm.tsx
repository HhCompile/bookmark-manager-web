import { useComplianceStore } from '../store/complianceStore';
import { Button } from '../components/ui/button';
import { apiService } from '../services/api';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface CoverageFormProps {
  onFileUpdated?: (filePath: string) => void;
}

const CoverageForm: React.FC<CoverageFormProps> = ({ onFileUpdated }) => {
  const { tasksFilePath, setTasksFilePath } = useComplianceStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const response = await apiService.updateTasksMd({
        filePath: tasksFilePath,
        requirementText: '系统必须确保测试任务明确要求80%的代码覆盖率',
      });

      if (response.status === 200) {
        toast.success('tasks.md file updated successfully!');
        if (onFileUpdated) {
          onFileUpdated(tasksFilePath);
        }
      } else {
        setError('Failed to update tasks.md file');
        toast.error('Failed to update tasks.md file');
      }
    } catch (err: any) {
      setError(
        err.message || 'An error occurred while updating the tasks.md file'
      );
      toast.error(
        err.message || 'An error occurred while updating the tasks.md file'
      );
    } finally {
      setIsUpdating(false);
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
          value={tasksFilePath}
          onChange={e => setTasksFilePath(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., tasks.md or docs/tasks.md"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Specify the path to the tasks.md file to update
        </p>
      </div>

      <Button type="submit" disabled={isUpdating} className="w-full">
        {isUpdating ? 'Updating...' : 'Update with Coverage Requirement'}
      </Button>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          Error: {error}
        </div>
      )}
    </form>
  );
};

export default CoverageForm;
