export default function Skeleton() {
  return (
    <div className="animate-pulse p-4 border rounded-lg">
      <div className="bg-gray-300 h-40 w-full rounded"></div>
      <div className="mt-3 h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}