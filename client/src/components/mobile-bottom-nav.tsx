export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 lg:hidden z-40">
      <div className="grid grid-cols-4 gap-1 py-2">
        <button className="flex flex-col items-center py-2 px-4 text-primary">
          <i className="fas fa-home text-lg mb-1"></i>
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center py-2 px-4 text-neutral-500 hover:text-primary transition-colors">
          <i className="fas fa-file-medical text-lg mb-1"></i>
          <span className="text-xs">Claims</span>
        </button>
        <button className="flex flex-col items-center py-2 px-4 text-neutral-500 hover:text-primary transition-colors">
          <i className="fas fa-calendar text-lg mb-1"></i>
          <span className="text-xs">Schedule</span>
        </button>
        <button className="flex flex-col items-center py-2 px-4 text-neutral-500 hover:text-primary transition-colors">
          <i className="fas fa-user text-lg mb-1"></i>
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}