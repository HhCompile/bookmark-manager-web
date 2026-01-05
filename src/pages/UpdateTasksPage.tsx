import { useComplianceStore } from '../store/complianceStore';
import { Button } from '../components/ui/button';
import { apiService } from '../services/api';
import React, { useState } from 'react';
import { toast } from 'sonner';

const UpdateTasksPage: React.FC = () => {
  const { tasksFilePath, setTasksFilePath, isUpdatingTasks, setUpdatingTasks } =
    useComplianceStore();
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateTasks = async () => {
    setUpdatingTasks(true);
    setError(null);

    try {
      const response = await apiService.updateTasksMd({
        filePath: tasksFilePath,
        requirementText: '系统必须确保测试任务明确要求80%的代码覆盖率',
      });

      if (response.status === 200) {
        setUpdated(true);
        toast.success(
          'tasks.md file updated successfully with coverage requirement!'
        );
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
      setUpdatingTasks(false);
    }
  };

  const handleReset = () => {
    setUpdated(false);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Update tasks.md with Coverage Requirement
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">File Configuration</h2>

        <div className="mb-4">
          <label
            htmlFor="filePath"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            tasks.md File Path
          </label>
          <input
            type="text"
            id="filePath"
            value={tasksFilePath}
            onChange={e => setTasksFilePath(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter file path (e.g., tasks.md)"
            disabled={isUpdatingTasks || updated}
          />
          <p className="mt-1 text-sm text-gray-500">
            Specify the path to the tasks.md file that needs to be updated
          </p>
        </div>

        {!updated ? (
          <Button
            onClick={handleUpdateTasks}
            disabled={isUpdatingTasks || !tasksFilePath}
            className="w-full py-3"
          >
            {isUpdatingTasks ? 'Updating...' : 'Update tasks.md File'}
          </Button>
        ) : (
          <div className="text-center">
            <div className="text-green-600 font-semibold mb-4">
              ✓ tasks.md file updated successfully at {tasksFilePath}
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full py-3"
            >
              Update Another File
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            Error: {error}
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Constitutional Requirements
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            The tasks.md file must explicitly mention the 80% code coverage
            requirement
          </li>
          <li>
            The requirement text must be:
            "系统必须确保测试任务明确要求80%的代码覆盖率"
          </li>
          <li>
            This ensures compliance with the project's quality红线 requirements
          </li>
          <li>The file will be updated at the specified path</li>
        </ul>
      </div>
    </div>
  );
};

export default UpdateTasksPage;
