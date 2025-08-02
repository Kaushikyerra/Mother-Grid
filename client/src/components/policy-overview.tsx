import { type Policy } from "../../shared/schema";

interface PolicyOverviewProps {
  policy?: Policy;
}

export default function PolicyOverview({ policy }: PolicyOverviewProps) {
  if (!policy) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Policy Overview</h3>
        <div className="text-center py-8">
          <i className="fas fa-file-contract text-4xl text-neutral-300 mb-4"></i>
          <p className="text-neutral-500">No policy information available</p>
        </div>
      </div>
    );
  }

  const totalCoverage = parseFloat(policy.totalCoverage);
  const usedAmount = parseFloat(policy.usedAmount || "0");
  const usagePercentage = (usedAmount / totalCoverage) * 100;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Policy Overview</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Policy Number</span>
          <span className="text-sm font-medium">{policy.policyNumber}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Coverage Type</span>
          <span className="text-sm font-medium">{policy.policyType}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Total Coverage</span>
          <span className="text-sm font-medium text-green-600">
            ${totalCoverage.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">Deductible</span>
          <span className="text-sm font-medium">${parseFloat(policy.deductible).toLocaleString()}</span>
        </div>
        
        <div className="pt-4 border-t border-neutral-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-500">Coverage Used</span>
            <span className="text-sm font-medium">${usedAmount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {usagePercentage.toFixed(1)}% of total coverage used
          </p>
        </div>
      </div>
    </div>
  );
}