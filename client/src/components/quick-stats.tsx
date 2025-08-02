interface QuickStatsProps {
  stats?: {
    activeClaims: number;
    coverageUsed: string;
  };
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Active Claims */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">Active Claims</p>
            <p className="text-2xl font-bold text-primary">{stats?.activeClaims || 0}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-file-medical text-primary text-xl"></i>
          </div>
        </div>
      </div>

      {/* Coverage Used */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">Coverage Used</p>
            <p className="text-2xl font-bold text-secondary">
              ${parseFloat(stats?.coverageUsed || "0").toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-shield-alt text-secondary text-xl"></i>
          </div>
        </div>
      </div>

      {/* Pregnancy Week */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">Pregnancy Week</p>
            <p className="text-lg font-semibold text-neutral-800">
              Week 22
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-baby text-accent text-xl"></i>
          </div>
        </div>
      </div>

      {/* Care Provider */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">Care Provider</p>
            <p className="text-lg font-semibold text-neutral-800">
              Women's Health Center
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-hospital text-primary text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
}