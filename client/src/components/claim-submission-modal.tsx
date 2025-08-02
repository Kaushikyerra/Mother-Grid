import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { type Policy } from "../../shared/schema";

interface ClaimSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  policyId?: string;
}

const claimTypes = [
  {
    id: "prenatal_checkup",
    title: "Prenatal Checkup",
    description: "Regular doctor visit",
    icon: "fas fa-user-md"
  },
  {
    id: "lab_tests",
    title: "Lab Tests", 
    description: "Blood work, screenings",
    icon: "fas fa-vial"
  },
  {
    id: "ultrasound",
    title: "Ultrasound",
    description: "Imaging and scans", 
    icon: "fas fa-camera"
  },
  {
    id: "emergency",
    title: "Emergency",
    description: "Urgent care visit",
    icon: "fas fa-hospital"
  }
];

export default function ClaimSubmissionModal({ isOpen, onClose, userId, policyId }: ClaimSubmissionModalProps) {
  const [selectedClaimType, setSelectedClaimType] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    visitDate: "",
    providerName: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitClaimMutation = useMutation({
    mutationFn: async (claimData: any) => {
      const response = await apiRequest("POST", "/api/claims", claimData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Claim Submitted Successfully",
        description: "Your claim has been submitted and is being processed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your claim. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedClaimType("");
    setFormData({
      title: "",
      description: "",
      amount: "",
      visitDate: "",
      providerName: "",
    });
    setUploadedFiles([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClaimType || !userId || !policyId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const selectedType = claimTypes.find(t => t.id === selectedClaimType);
    
    submitClaimMutation.mutate({
      userId,
      policyId,
      claimType: selectedClaimType,
      title: formData.title || selectedType?.title || "",
      description: formData.description || selectedType?.description || "",
      amount: formData.amount,
      visitDate: new Date(formData.visitDate).toISOString(),
      providerName: formData.providerName,
      status: "submitted",
      documents: uploadedFiles.map(f => ({ name: f.name, size: f.size })),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Show success message for file upload
    if (files.length > 0) {
      toast({
        title: "Files Added",
        description: `${files.length} document(s) added to your claim.`,
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-800">Submit New Claim</h3>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Claim Type Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <i className="fas fa-stethoscope mr-2"></i>Type of Visit
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {claimTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedClaimType(type.id)}
                  className={`flex items-center p-4 border-2 rounded-lg transition-colors ${
                    selectedClaimType === type.id
                      ? "border-primary bg-blue-50"
                      : "border-neutral-200 hover:border-primary hover:bg-blue-50"
                  }`}
                >
                  <i className={`${type.icon} text-primary text-xl mr-3`}></i>
                  <div className="text-left">
                    <p className="font-medium text-neutral-800">{type.title}</p>
                    <p className="text-sm text-neutral-500">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Visit Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="visitDate" className="block text-sm font-medium text-neutral-700 mb-1">Visit Date</label>
              <input
                id="visitDate"
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData(prev => ({ ...prev, visitDate: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1">Cost Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Provider Information */}
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-neutral-700 mb-1">Healthcare Provider</label>
            <input
              id="provider"
              placeholder="Dr. Smith, General Hospital"
              value={formData.providerName}
              onChange={(e) => setFormData(prev => ({ ...prev, providerName: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Title and Description */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">Visit Title (Optional)</label>
            <input
              id="title"
              placeholder="Brief description of the visit"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">Additional Notes (Optional)</label>
            <textarea
              id="description"
              placeholder="Any additional details about the visit..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              <i className="fas fa-paperclip mr-2"></i>Supporting Documents
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <i className="fas fa-cloud-upload-alt text-4xl text-neutral-400 mb-2"></i>
              <p className="text-neutral-600 mb-2">Drop files here or click to browse</p>
              <p className="text-sm text-neutral-500">PDF, JPG, PNG up to 10MB each</p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="fileUpload"
              />
              <button
                type="button"
                className="mt-2 px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
                onClick={() => document.getElementById('fileUpload')?.click()}
              >
                Choose Files
              </button>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                    <span className="text-sm text-neutral-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-times text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Smart Contract Preview */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-cubes text-accent"></i>
              <span className="text-sm font-medium text-neutral-800">Smart Contract Preview</span>
            </div>
            <p className="text-sm text-neutral-600">
              This claim will automatically trigger verification and processing through our blockchain smart contract system.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={submitClaimMutation.isPending}
            >
              {submitClaimMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Claim
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}