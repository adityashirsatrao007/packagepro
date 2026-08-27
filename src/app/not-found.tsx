import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <p className="text-gray-500 mt-2">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Back to Packages
      </Link>
    </main>
  );
}
