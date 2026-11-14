import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export function getUploadDir() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function saveUpload(file: File): Promise<{ filename: string; url: string }> {
  const uploadDir = getUploadDir();
  await mkdir(uploadDir, { recursive: true });

  const original = sanitizeFilename(file.name || 'upload.bin');
  const timestamp = Date.now();
  const filename = `${timestamp}-${original}`;
  const dest = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(dest, buffer);

  // Served from /uploads/<filename> (public/uploads or Docker volume)
  return {
    filename,
    url: `/uploads/${filename}`,
  };
}
