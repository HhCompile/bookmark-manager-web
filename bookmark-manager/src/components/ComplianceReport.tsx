import React from 'react';

interface ComplianceReportProps {
  complianceData: {
    todoMdExists: boolean;
    todoMdValid: boolean;
    tasksMdHasCoverageRequirement: boolean;
    complianceStatus: string;
    details?: {
      todoMdMessage?: string;
      tasksMdMessage?: string;
    };
  };
}

const ComplianceReport: React.FC<ComplianceReportProps> = ({ complianceData }) => {
  const getStatusIcon = (status: boolean) => {
    return status ? (
      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'fully_compliant':
        return 'text-green-600 bg-green-100';
      case 'non_compliant':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getComplianceStatusText = (status: string) => {
    switch (status) {
      case 'fully_compliant':
        return 'Fully Compliant';
      case 'non_compliant':
        return 'Non-Compliant';
      default:
        return 'Partially Compliant';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Compliance Report</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplianceStatusColor(complianceData.complianceStatus)}`}>
          {getComplianceStatusText(complianceData.complianceStatus)}
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-lg mb-3">TODO.md Requirements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">File Exists</span>
              <div className="flex items-center">
                {getStatusIcon(complianceData.todoMdExists)}
                <span className="ml-2">{complianceData.todoMdExists ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">Valid Structure</span>
              <div className="flex items-center">
                {getStatusIcon(complianceData.todoMdValid)}
                <span className="ml-2">{complianceData.todoMdValid ? 'Yes' : 'No'}</span>
              </div>
            </div>
            {complianceData.details?.todoMdMessage && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <span className="font-medium">Details: </span>
                {complianceData.details.todoMdMessage}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-lg mb-3">Tasks.md Requirements</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">80% Coverage Requirement</span>
              <div className="flex items-center">
                {getStatusIcon(complianceData.tasksMdHasCoverageRequirement)}
                <span className="ml-2">
                  {complianceData.tasksMdHasCoverageRequirement ? 'Present' : 'Missing'}
                </span>
              </div>
            </div>
            {complianceData.details?.tasksMdMessage && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                <span className="font-medium">Details: </span>
                {complianceData.details.tasksMdMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <h3 className="font-medium mb-2">Constitutional Requirements Summary</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
          <li>TODO.md文件必须包含四个部分（待完成、待验证、已完成、任务详情）</li>
          <li>每个部分必须是表格格式，包含任务ID、简短描述、日期列</li>
          <li>tasks.md文件必须明确包含80%代码覆盖率要求</li>
        </ul>
      </div>
    </div>
  );
};

export default ComplianceReport;