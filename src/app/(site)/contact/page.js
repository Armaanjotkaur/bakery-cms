import ContactForm from "@/components/site/ContactForm";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Sweet Crumb Bakery.",
};

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8 text-stone-900">Contact Us</h1>
      <ContactForm />
    </div>
  );
}
