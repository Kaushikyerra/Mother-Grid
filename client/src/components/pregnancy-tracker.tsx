import { type User } from "../../shared/schema";

interface PregnancyTrackerProps {
  user?: User;
}

export default function PregnancyTracker({ user }: PregnancyTrackerProps) {
  const pregnancyWeek = parseInt(user?.pregnancyWeek || "24");
  const progressPercentage = Math.min((pregnancyWeek / 40) * 100, 100);
  
  const milestones = [
    { week: 12, title: "End of First Trimester", icon: "fas fa-seedling", color: "text-green-500" },
    { week: 20, title: "Anatomy Scan", icon: "fas fa-camera", color: "text-blue-500" },
    { week: 28, title: "Third Trimester Begins", icon: "fas fa-baby", color: "text-purple-500" },
    { week: 36, title: "Full Term Approaching", icon: "fas fa-heart", color: "text-red-500" },
    { week: 40, title: "Due Date", icon: "fas fa-star", color: "text-yellow-500" }
  ];

  const getTrimesters = () => {
    if (pregnancyWeek <= 12) return { current: "First", weeks: "1-12 weeks", description: "Foundation period" };
    if (pregnancyWeek <= 28) return { current: "Second", weeks: "13-28 weeks", description: "Growth period" };
    return { current: "Third", weeks: "29-40 weeks", description: "Final preparation" };
  };

  const trimester = getTrimesters();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800">Pregnancy Journey</h3>
          <p className="text-sm text-neutral-500">Week {pregnancyWeek} of 40</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{pregnancyWeek}</div>
          <div className="text-xs text-neutral-500">weeks</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-neutral-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Current Trimester */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6 border border-purple-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <i className="fas fa-calendar-alt text-white"></i>
          </div>
          <div>
            <h4 className="font-medium text-neutral-800">{trimester.current} Trimester</h4>
            <p className="text-sm text-neutral-600">{trimester.weeks} - {trimester.description}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div>
        <h4 className="font-medium text-neutral-800 mb-4">Pregnancy Milestones</h4>
        <div className="space-y-3">
          {milestones.map((milestone, index) => {
            const isPassed = pregnancyWeek >= milestone.week;
            const isCurrent = pregnancyWeek >= milestone.week - 2 && pregnancyWeek <= milestone.week + 1;
            
            return (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isCurrent 
                    ? 'bg-blue-50 border border-blue-200' 
                    : isPassed 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-neutral-50 border border-neutral-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isPassed ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-neutral-300'
                }`}>
                  <i className={`${milestone.icon} text-white text-sm`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-neutral-800 text-sm">{milestone.title}</span>
                    {isPassed && <i className="fas fa-check text-green-500 text-xs"></i>}
                    {isCurrent && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Current</span>}
                  </div>
                  <p className="text-xs text-neutral-500">Week {milestone.week}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <i className="fas fa-lightbulb text-blue-500 mt-1"></i>
          <div>
            <h5 className="font-medium text-blue-800 text-sm mb-1">What's Next?</h5>
            <p className="text-blue-700 text-xs">
              {pregnancyWeek < 20 
                ? "Schedule your anatomy scan around week 20 for detailed baby development check."
                : pregnancyWeek < 28
                ? "Begin preparing for third trimester appointments and glucose screening."
                : pregnancyWeek < 36
                ? "Start discussing birth plan options and hospital registration."
                : "Prepare your hospital bag and finalize newborn care arrangements."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}