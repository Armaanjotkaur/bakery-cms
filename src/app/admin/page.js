import { getSession } from "@/lib/auth";

export default async function AdminHome() {
  const session = await getSession();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Signed in as {session.email}</p>
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Log out
        </button>
      </form>
    </main>
  );
}
