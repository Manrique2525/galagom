export default function RouteDecor({ className = "" }: { className?: string }) {
  return <div className={`flex items-center gap-3 text-[#A9B9D8] ${className}`} aria-hidden="true"><span className="h-2 w-2 rounded-full bg-current" /><span className="h-px w-20 bg-current/50" /><span className="h-1.5 w-1.5 rounded-full border border-current" /><span className="h-px w-10 bg-current/50" /><span className="text-lg leading-none">→</span></div>;
}
