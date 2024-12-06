export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-gray-100">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="mt-4 text-2xl text-gray-300">Oops! Page Not Found</p>
      <p className="mt-2 text-gray-500">
        {`The page you're looking for doesn't exist or has been moved.`}
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-2 text-gray-900 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Go Back Home
      </a>
    </div>
  );
}
