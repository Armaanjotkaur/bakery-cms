import mongoose from "mongoose";

// Side-effect imports: every model must be registered before any query can
// .populate() a ref to it by name, regardless of which page happens to run
// first in this process. Without this, whichever route is hit first only
// registers the models it directly imports, and populating a ref to a model
// nothing has loaded yet throws MissingSchemaError.
import "@/models/Category";
import "@/models/Media";
import "@/models/Service";
import "@/models/Post";
import "@/models/Page";
import "@/models/Submission";

let cached = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI);
  }
  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}
