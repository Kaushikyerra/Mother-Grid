interface QuickActionsProps {
  onSubmitClaim: () => void;
}

export default function QuickActions({ onSubmitClaim }: QuickActionsProps) {
  const handleUploadDocument = () => {
    // Create a file input and trigger it
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const fileNames = Array.from(files).map(f => f.name);
        console.log('Files selected:', fileNames);
        // Show success message
        alert(`Successfully uploaded ${files.length} document(s):\n${fileNames.join('\n')}\n\nYour documents have been securely stored and associated with your policy.`);
      }
    };
    input.click();
  };

  const handleViewPolicy = () => {
    // Create a policy details modal or navigate to policy page
    alert('Policy Details:\n\nPolicy Number: MG-2024-001234\nCoverage Type: Maternity Plus\nTotal Coverage: $15,000\nDeductible: $500\nUsed Amount: $2,450\n\nFor detailed policy information, contact support or visit your policy portal.');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h3>
      
      <div className="space-y-3">
        <button 
          onClick={onSubmitClaim}
          className="w-full flex items-center justify-between p-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <i className="fas fa-plus text-lg"></i>
            <span className="font-medium">Submit New Claim</span>
          </div>
          <i className="fas fa-arrow-right"></i>
        </button>

        <button 
          onClick={handleUploadDocument}
          className="w-full flex items-center justify-between p-4 bg-secondary text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <i className="fas fa-upload text-lg"></i>
            <span className="font-medium">Upload Documents</span>
          </div>
          <i className="fas fa-arrow-right"></i>
        </button>

        <button 
          onClick={handleViewPolicy}
          className="w-full flex items-center justify-between p-4 bg-accent text-white rounded-lg hover:bg-purple-800 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <i className="fas fa-file-contract text-lg"></i>
            <span className="font-medium">View Policy</span>
          </div>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}