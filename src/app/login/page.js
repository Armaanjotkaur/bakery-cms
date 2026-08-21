const ERROR_MESSAGES = {
  unauthorized: "That account isn't authorized for admin access.",
  missing_code: "Login was cancelled or failed. Please try again.",
  no_email: "GitHub didn't share an email for that account. Make your email public on GitHub, or sign in with Google instead.",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold mb-1">Admin Login</h1>
        <p className="text-gray-500 mb-6">Bakery CMS</p>

        {error && (
          <p className="text-red-600 text-sm mb-4">
            {ERROR_MESSAGES[error] || "Login failed. Please try again."}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <a
            href="/api/auth/google"
            className="block w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Sign in with Google
          </a>
          <a
            href="/api/auth/github"
            className="block w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Sign in with GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
