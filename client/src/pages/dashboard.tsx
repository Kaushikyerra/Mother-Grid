import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import QuickStats from "../components/quick-stats";
import ClaimTimeline from "../components/claim-timeline";
import PregnancyTracker from "../components/pregnancy-tracker";

import QuickActions from "../components/quick-actions";
import PolicyOverview from "../components/policy-overview";
import AIAssistant from "../components/ai-assistant";
import VoiceAssistant from "../components/voice-assistant";
import ClaimSubmissionModal from "../components/claim-submission-modal";
import MobileBottomNav from "../components/mobile-bottom-nav";

export default function Dashboard() {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  
  // Get the actual user ID from sample data - in a real app this would come from authentication
  // We'll get the first user from our sample data
  const userId = "user-1";

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard", userId],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-neutral-600">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">Unable to load dashboard</h2>
          <p className="text-neutral-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const { user, policy, claims, stats } = dashboardData || {};

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-heartbeat text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">MotherGrid</h1>
                <p className="text-xs text-neutral-500">Web3 Healthcare</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-neutral-500 hover:text-primary transition-colors">
                <i className="fas fa-bell text-lg"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-white text-sm"></i>
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-neutral-500">Track your maternity care journey and insurance claims with ease.</p>
        </div>

        {/* Quick Stats Cards */}
        <QuickStats stats={stats} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column: Claim Timeline & Pregnancy Tracker */}
          <div className="xl:col-span-2 space-y-6">
            <ClaimTimeline 
              claims={claims || []} 
              pregnancyWeek={user?.pregnancyWeek}
            />
            <PregnancyTracker user={user} />
          </div>

          {/* Right Column: Quick Actions & Policy Info */}
          <div className="space-y-6">
            <QuickActions onSubmitClaim={() => setIsClaimModalOpen(true)} />
            <PolicyOverview policy={policy} />
          </div>

          {/* Assistant Column: Voice & AI Assistants */}
          <div className="space-y-6">
            <VoiceAssistant 
              onSubmitClaim={() => setIsClaimModalOpen(true)}
              onViewPolicy={() => alert('Policy Details:\n\nPolicy Number: MG-2024-001234\nCoverage Type: Maternity Plus\nTotal Coverage: $15,000\nDeductible: $500\nUsed Amount: $2,450\n\nFor detailed policy information, contact support or visit your policy portal.')}
              userData={{ user, policy }}
              claims={claims}
            />
            <AIAssistant />
          </div>
        </div>
        
        {/* Mobile Assistant Section */}
        <div className="xl:hidden mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <VoiceAssistant 
            onSubmitClaim={() => setIsClaimModalOpen(true)}
            onViewPolicy={() => alert('Policy Details:\n\nPolicy Number: MG-2024-001234\nCoverage Type: Maternity Plus\nTotal Coverage: $15,000\nDeductible: $500\nUsed Amount: $2,450\n\nFor detailed policy information, contact support or visit your policy portal.')}
            userData={{ user, policy }}
            claims={claims}
          />
          <AIAssistant />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Claim Submission Modal */}
      <ClaimSubmissionModal 
        isOpen={isClaimModalOpen} 
        onClose={() => setIsClaimModalOpen(false)}
        userId={userId}
        policyId={policy?.id}
      />
    </div>
  );
}
