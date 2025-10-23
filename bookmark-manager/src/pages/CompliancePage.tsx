import React, { useState } from 'react';
import { useComplianceStore } from '../store/complianceStore';
import { apiService } from '../services/api';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const CompliancePage: React.FC = () => {
  const { isVerifyingCompliance, setVerifyingCompliance, setComplianceStatus } =
    useComplianceStore();
  const [complianceResult, setComplianceResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyCompliance = async () => {
    setVerifyingCompliance(true);
    setError(null);
    setComplianceResult(null);

    try {
      const response = await apiService.verifyCompliance();

      if (response.status === 200) {
        setComplianceResult(response.data);
        setComplianceStatus({
          todoExists: response.data.todoMdExists,
          todoValid: response.data.todoMdValid,
          tasksHasCoverage: response.data.tasksMdHasCoverageRequirement,
          isCompliant: response.data.complianceStatus === 'fully_compliant',
        });

        if (response.data.complianceStatus === 'fully_compliant') {
          toast.success(
            'Project is fully compliant with constitutional requirements!'
          );
        } else {
          toast.warning(
            'Project is not fully compliant. Please check the details.'
          );
        }
      } else {
        setError('Failed to verify compliance');
        toast.error('Failed to verify compliance');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while verifying compliance');
      toast.error(
        err.message || 'An error occurred while verifying compliance'
      );
    } finally {
      setVerifyingCompliance(false);
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'fully_compliant':
        return 'text-green-600';
      case 'non_compliant':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Constitutional Compliance Verification
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Verify Compliance</h2>
          <Button
            onClick={handleVerifyCompliance}
            disabled={isVerifyingCompliance}
            className="py-2 px-4"
          >
            {isVerifyingCompliance ? 'Verifying...' : 'Verify Compliance'}
          </Button>
        </div>

        <p className="text-gray-600 mb-4">
          Check if your project meets all constitutional requirements for
          TODO.md structure and test coverage.
        </p>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md mb-4">
            Error: {error}
          </div>
        )}

        {complianceResult && (
          <div className="mt-6">
            <div
              className={`text-2xl font-bold mb-4 ${getComplianceStatusColor(
                complianceResult.complianceStatus
              )}`}
            >
              {getComplianceStatusText(complianceResult.complianceStatus)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">TODO.md Requirements</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>File Exists:</span>
                    <span
                      className={
                        complianceResult.todoMdExists
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {complianceResult.todoMdExists ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Structure:</span>
                    <span
                      className={
                        complianceResult.todoMdValid
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {complianceResult.todoMdValid ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  {complianceResult.details?.todoMdMessage && (
                    <div className="text-sm text-gray-500">
                      {complianceResult.details.todoMdMessage}
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Tasks.md Requirements</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Coverage Requirement:</span>
                    <span
                      className={
                        complianceResult.tasksMdHasCoverageRequirement
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {complianceResult.tasksMdHasCoverageRequirement
                        ? '✓ Present'
                        : '✗ Missing'}
                    </span>
                  </div>
                  {complianceResult.details?.tasksMdMessage && (
                    <div className="text-sm text-gray-500">
                      {complianceResult.details.tasksMdMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Constitutional Requirements
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>TODO.md文件必须包含四个部分：待完成、待验证、已完成、任务详情</li>
          <li>每个部分必须是表格格式，包含任务ID、简短描述、日期列</li>
          <li>tasks.md文件必须明确包含80%代码覆盖率要求</li>
          <li>项目必须同时满足所有要求才能被视为完全合规</li>
        </ul>
      </div>
    </div>
  );
};

export default CompliancePage;
