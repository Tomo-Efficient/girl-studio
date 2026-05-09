export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-6 w-20 bg-[#f2ede7] rounded-full animate-pulse" />
        ))}
      </div>
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4 rounded-sm bg-white border border-[#e8dfd5] animate-pulse">
            <div className="h-48 bg-[#f2ede7]" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-[#f2ede7] rounded w-2/3" />
              <div className="h-3 bg-[#f2ede7] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
