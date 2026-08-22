import { slugify } from "@/lib/slugify";

export async function generateUniqueSlug(Model, title, excludeId) {
  const base = slugify(title);
  let slug = base;
  let i = 1;
  while (await Model.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}
