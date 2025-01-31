"use client"

import { uploadText } from "@/lib/pinecone";
import { processFileInChunks } from "@/lib/file-utils";
import { ArticleMetadata } from "@/types/schema";

export async function uploadFile(file: File, metadata: Partial<ArticleMetadata>) {
    processFileInChunks(file, 600, 100, (chunk) => {
        return new Promise<void>(async () => {
            await uploadText(chunk, metadata)
        });
   });
}