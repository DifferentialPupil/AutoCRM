"use client"

/**
 * Utility functions for client-side file operations
 */

/**
 * Read a file and return its contents as text
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

/**
 * Split text into chunks with overlap
 */
export const splitTextIntoChunks = (
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] => {
  if (chunkSize <= 0) throw new Error('Chunk size must be positive');
  if (overlap >= chunkSize) throw new Error('Overlap must be smaller than chunk size');
  if (overlap < 0) throw new Error('Overlap must be non-negative');

  const chunks: string[] = [];
  let currentPosition = 0;

  while (currentPosition < text.length) {
    // Calculate the end position for this chunk
    const endPosition = Math.min(currentPosition + chunkSize, text.length);
    
    // Extract the chunk
    const chunk = text.slice(currentPosition, endPosition);
    chunks.push(chunk);

    // Move the position forward by chunkSize - overlap
    currentPosition += chunkSize - overlap;
  }

  return chunks;
};

/**
 * Process a file in chunks with overlap
 * TODO: use stream to process file in chunks
 */
export const processFileInChunks = async (
  file: File,
  chunkSize: number = 600,
  overlap: number = 100,
  processChunk?: (chunk: string, index: number) => Promise<void>
): Promise<string[]> => {
  try {
    // Read the entire file
    const text = await readFileAsText(file);
    
    // Split into chunks
    const chunks = splitTextIntoChunks(text, chunkSize, overlap);
    
    // Process each chunk if a processor is provided
    if (processChunk) {
      await Promise.all(
        chunks.map((chunk, index) => processChunk(chunk, index))
      );
    }
    
    return chunks;
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
};

/**
 * Get file metadata
 */
export const getFileMetadata = (file: File) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified),
  };
};
