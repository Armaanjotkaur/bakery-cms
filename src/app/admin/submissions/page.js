import { dbConnect } from "@/lib/db";
import Submission from "@/models/Submission";
import DeleteButton from "@/components/admin/DeleteButton";
import MarkReadButton from "@/components/admin/MarkReadButton";

export default async function SubmissionsPage() {
  await dbConnect();
  const submissions = await Submission.find().sort({ createdAt: -1 }).lean();

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-stone-900">Submissions</h1>

      <table className="w-full text-sm border border-rose-100 rounded-lg overflow-hidden">
        <thead className="bg-rose-50/60 text-left text-stone-700">
          <tr>
            <th className="p-3">From</th>
            <th className="p-3">Message</th>
            <th className="p-3">Received</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr
              key={String(s._id)}
              className={`border-t border-rose-50 text-stone-900 ${!s.isRead ? "font-semibold bg-amber-50" : ""}`}
            >
              <td className="p-3">
                <p>{s.name}</p>
                <p className="text-xs text-stone-500 font-normal">{s.email}</p>
              </td>
              <td className="p-3 max-w-sm truncate font-normal" title={s.message}>
                {s.message}
              </td>
              <td className="p-3 text-stone-500 font-normal">{new Date(s.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <MarkReadButton id={String(s._id)} isRead={s.isRead} />
                  <DeleteButton url={`/api/submissions/${s._id}`} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {submissions.length === 0 && <p className="text-stone-500 text-center py-8">No submissions yet.</p>}
    </main>
  );
}
