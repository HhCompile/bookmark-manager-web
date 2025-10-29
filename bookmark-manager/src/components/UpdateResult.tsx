import React from 'react';

interface UpdateResultProps {
  filePath: string;
  success: boolean;
  message: string;
  error?: string;
}

const UpdateResult: React.FC<UpdateResultProps> = ({ 
  filePath, 
  success, 
  message, 
  error 
}) => {
  return (
    <div className={`p-4 rounded-md ${success ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${success ? 'text-green-500' : 'text-red-500'}`}>
          {success ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${success ? 'text-green-800' : 'text-red-800'}`}>
            {success ? 'File Updated Successfully' : 'Update Failed'}
          </h3>
          <div className={`mt-2 text-sm ${success ? 'text-green-700' : 'text-red-700'}`}>
            <p>
              File Path: <strong>{filePath}</strong>
            </p>
            <p className="mt-1">{message}</p>
            {error && (
              <p className="mt-1 font-medium">
                Error: {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateResult;