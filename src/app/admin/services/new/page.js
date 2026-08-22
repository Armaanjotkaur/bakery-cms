import ServiceForm from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">New Service</h1>
      <ServiceForm />
    </main>
  );
}
