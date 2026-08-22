const ERROR_MESSAGES = {
  unauthorized: "That account isn't authorized for admin access.",
  missing_code: "Login was cancelled or failed. Please try again.",
  no_email: "GitHub didn't share an email for that account. Make your email public on GitHub, or sign in with Google instead.",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="min-h-screen flex items-center justify-center bg-rose-50/40 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center border border-rose-100">
        <h1 className="text-2xl font-semibold mb-1 text-rose-700">Admin Login</h1>
        <p className="text-stone-500 mb-6">Bakery CMS</p>

        {error && (
          <p className="text-red-600 text-sm mb-4">
            {ERROR_MESSAGES[error] || "Login failed. Please try again."}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <a
            href="/api/auth/google"
            className="block w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700 transition"
          >
            Sign in with Google
          </a>
          <a
            href="/api/auth/github"
            className="block w-full border border-rose-200 text-stone-700 py-2 rounded-md hover:bg-rose-50 transition"
          >
            Sign in with GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
