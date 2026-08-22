import Media from "@/models/Media";

// Media.usedIn tracks which content docs reference each file, so the media
// library can show "used in N place(s)" and deletes/replaces stay traceable.
export async function trackUsedIn(mediaId, refType, refId) {
  if (!mediaId) return;
  await Media.updateOne({ _id: mediaId }, { $pull: { usedIn: { refType, refId } } });
  await Media.updateOne({ _id: mediaId }, { $push: { usedIn: { refType, refId } } });
}

export async function untrackUsedIn(mediaId, refType, refId) {
  if (!mediaId) return;
  await Media.updateOne({ _id: mediaId }, { $pull: { usedIn: { refType, refId } } });
}
