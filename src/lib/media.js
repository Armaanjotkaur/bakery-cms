export const ALLOWED_MIME_TYPES = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "doc",
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateUploadedFile(file) {
  if (!file || typeof file === "string") {
    return { error: "No file provided", status: 400 };
  }
  if (file.size === 0) {
    return { error: "File is empty", status: 400 };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File exceeds 5 MB limit", status: 413 };
  }
  const fileType = ALLOWED_MIME_TYPES[file.type];
  if (!fileType) {
    return { error: `Unsupported file type: ${file.type}`, status: 400 };
  }
  return { fileType };
}
