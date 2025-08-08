export default function CalmCornerLoading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-8 py-8">
      <div className="h-8 w-56 bg-gradient-to-r from-gray-200 to-gray-100 rounded" />
      <div className="h-64 rounded-xl bg-gradient-to-br from-gray-200 to-gray-100" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-gradient-to-br from-gray-200 to-gray-100 h-28" />
        ))}
      </div>
    </div>
  );
}
