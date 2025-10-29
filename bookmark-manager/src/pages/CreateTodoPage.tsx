import React, { useState } from 'react';
import { useComplianceStore } from '../store/complianceStore';
import { apiService } from '../services/api';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const CreateTodoPage: React.FC = () => {
  const { todoFilePath, setTodoFilePath, isCreatingTodo, setCreatingTodo } = useComplianceStore();
  const [overwrite, setOverwrite] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTodo = async () => {
    setCreatingTodo(true);
    setError(null);
    
    try {
      const response = await apiService.createTodoMd({
        filePath: todoFilePath,
        overwrite: overwrite
      });
      
      if (response.status === 201) {
        setCreated(true);
        toast.success('TODO.md file created successfully!');
      } else {
        setError('Failed to create TODO.md file');
        toast.error('Failed to create TODO.md file');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the TODO.md file');
      toast.error(err.message || 'An error occurred while creating the TODO.md file');
    } finally {
      setCreatingTodo(false);
    }
  };

  const handleReset = () => {
    setCreated(false);
    setError(null);
    setOverwrite(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Constitution-Compliant TODO.md</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">File Configuration</h2>
        
        <div className="mb-4">
          <label htmlFor="filePath" className="block text-sm font-medium text-gray-700 mb-2">
            TODO.md File Path
          </label>
          <input
            type="text"
            id="filePath"
            value={todoFilePath}
            onChange={(e) => setTodoFilePath(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter file path (e.g., TODO.md)"
            disabled={isCreatingTodo || created}
          />
          <p className="mt-1 text-sm text-gray-500">
            Specify the path where the TODO.md file will be created
          </p>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={overwrite}
              onChange={(e) => setOverwrite(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isCreatingTodo || created}
            />
            <span className="ml-2 text-sm text-gray-700">
              Overwrite existing file
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Check this box to replace an existing TODO.md file
          </p>
        </div>
        
        {!created ? (
          <Button
            onClick={handleCreateTodo}
            disabled={isCreatingTodo || !todoFilePath}
            className="w-full py-3"
          >
            {isCreatingTodo ? 'Creating...' : 'Create TODO.md File'}
          </Button>
        ) : (
          <div className="text-center">
            <div className="text-green-600 font-semibold mb-4">
              ✓ TODO.md file created successfully at {todoFilePath}
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full py-3"
            >
              Create Another File
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
        <h2 className="text-xl font-semibold mb-4">Constitutional Requirements</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>The TODO.md file must contain four sections: 待完成, 待验证, 已完成, 任务详情</li>
          <li>Each section must be in table format with headers: 任务ID, 简短描述, 日期</li>
          <li>The file will be created at the project root by default</li>
          <li>File structure complies with project constitution requirements</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateTodoPage;