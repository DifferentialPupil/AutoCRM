import { supabase } from '@/lib/supabase'

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET_NAME || 'knowledge_base'

export type ArticleFile = {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: Record<string, any>
}

/**
 * Lists all articles in the knowledge base bucket
 */
export async function listArticles(): Promise<ArticleFile[]> {
    const { data, error } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list()

    if (error) {
        throw new Error(`Failed to list articles: ${error.message}`)
    }

    return data;
}

/**
 * Uploads an article file to the knowledge base bucket
 */
export async function uploadArticle(file: File, metadata?: Record<string, any>) {
  const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .upload(`${file.name}`, file, {
      upsert: false,
      contentType: file.type,
      metadata
    })

  if (error) {
    throw new Error(`Failed to upload article: ${error.message}`)
  }

  return data
}

/**
 * Downloads an article file from the knowledge base bucket
 */
export async function downloadArticle(path: string) {
  const { data, error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .download(path)

  if (error) {
    throw new Error(`Failed to download article: ${error.message}`)
  }

  return data
}

/**
 * Deletes an article file from the knowledge base bucket
 */
export async function deleteArticle(path: string) {
  const { error } = await supabase
    .storage
    .from(BUCKET_NAME)
    .remove([path])

  if (error) {
    throw new Error(`Failed to delete article: ${error.message}`)
  }
}

/**
 * Gets the public URL for an article
 */
export function getArticleUrl(path: string) {
  return supabase
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(path)
    .data
    .publicUrl
} 