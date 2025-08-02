import { type Claim } from "../../shared/schema";

interface ClaimTimelineProps {
  claims: Claim[];
  pregnancyWeek?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
    case "paid":
      return "bg-green-500";
    case "under_review":
    case "submitted":
      return "bg-orange-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-neutral-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
    case "paid":
      return "fas fa-check";
    case "under_review":
    case "submitted":
      return "fas fa-clock";
    case "rejected":
      return "fas fa-times";
    default:
      return "fas fa-calendar";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "paid":
      return "bg-green-100 text-green-800";
    case "under_review":
      return "bg-orange-100 text-orange-800";
    case "submitted":
      return "bg-blue-100 text-blue-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "scheduled":
      return "bg-neutral-100 text-neutral-600";
    default:
      return "bg-neutral-100 text-neutral-600";
  }
};

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const formatAmount = (amount: string) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

export default function ClaimTimeline({ claims, pregnancyWeek }: ClaimTimelineProps) {
  // Sort claims by date
  const timelineItems = claims
    .map(claim => ({
      ...claim,
      type: 'claim' as const,
      date: claim.visitDate,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">Current Pregnancy Journey</h3>
        {pregnancyWeek && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Week {pregnancyWeek}
          </span>
        )}
      </div>

      {timelineItems.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-file-medical text-4xl text-neutral-300 mb-4"></i>
          <p className="text-neutral-500">No claims submitted yet</p>
        </div>
      ) : (
        <div className="relative">
          {timelineItems.map((item, index) => (
            <div key={item.id} className="flex items-start space-x-4 pb-6 last:pb-0">
              <div className={`flex-shrink-0 w-10 h-10 ${getStatusColor(item.status)} rounded-full flex items-center justify-center ${
                item.status === 'under_review' || item.status === 'submitted' ? 'animate-pulse' : ''
              }`}>
                <i className={`${getStatusIcon(item.status)} text-white text-sm`}></i>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-800">{item.title}</p>
                  <span className="text-xs text-neutral-500">{formatDate(item.date)}</span>
                </div>
                
                <p className="text-sm text-neutral-500 mt-1">
                  {item.description}
                </p>
                
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`${getStatusBadge(item.status)} text-xs font-medium px-2 py-1 rounded`}>
                    {item.status === 'under_review' ? 'Under Review' : 
                     item.status === 'approved' ? 'Claim Approved' :
                     item.status === 'paid' ? 'Paid' :
                     item.status === 'submitted' ? 'Submitted' :
                     item.status === 'scheduled' ? 'Scheduled' :
                     item.status}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {item.type === 'appointment' && item.amount ? `Est. ${formatAmount(item.amount)}` : formatAmount(item.amount)}
                  </span>
                </div>
                
                <p className="text-xs text-neutral-400 mt-1">{item.providerName}</p>
              </div>
              
              {index < timelineItems.length - 1 && (
                <div className="absolute left-5 top-12 w-px h-12 bg-neutral-200"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}