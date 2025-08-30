export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your content</p>
      </div>
    </div>
  );
}
