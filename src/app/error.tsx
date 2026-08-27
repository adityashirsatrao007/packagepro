"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-300">Error</h1>
      <p className="text-xl text-gray-600 mt-4">Something went wrong</p>
      <p className="text-gray-500 mt-2 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </main>
  );
}
