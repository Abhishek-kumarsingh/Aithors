import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the upload directory path
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists
function ensureUploadDirExists() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Saves a file to the uploads directory
 * @param file The file buffer to save
 * @param originalFilename The original filename
 * @returns The URL path to the saved file
 */
export async function saveFile(file: Buffer, originalFilename: string): Promise<string> {
  ensureUploadDirExists();
  
  // Generate a unique filename to prevent collisions
  const fileExtension = path.extname(originalFilename);
  const filename = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  // Write the file to disk
  await fs.promises.writeFile(filePath, file);
  
  // Return the URL path (relative to public directory)
  return `/uploads/${filename}`;
}

/**
 * Deletes a file from the uploads directory
 * @param fileUrl The URL path of the file to delete
 * @returns A boolean indicating whether the deletion was successful
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    // Extract the filename from the URL
    const filename = path.basename(fileUrl);
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      await fs.promises.unlink(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}