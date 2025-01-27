'use client'

import { useEffect } from "react"
import { useKnowledgeBaseStore } from "@/lib/store"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"
import { ArticleCategory } from "@/types/schema"

const categoryColors: Record<ArticleCategory, string> = {
  general: "bg-blue-500/20 text-blue-700",
  tutorial: "bg-green-500/20 text-green-700",
  faq: "bg-purple-500/20 text-purple-700",
  troubleshooting: "bg-orange-500/20 text-orange-700",
  api: "bg-red-500/20 text-red-700",
}

export function KnowledgeBaseTable() {
  const { articles, isLoading, error, fetchArticles, downloadArticle, deleteArticle } = useKnowledgeBaseStore()

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleDownload = async (path: string) => {
    try {
      const blob = await downloadArticle(path)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = path
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download article:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">
                {article.metadata?.title || article.name}
                {article.metadata?.published === false && (
                  <Badge variant="outline" className="ml-2">
                    Draft
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {article.metadata?.category && (
                  <Badge variant="secondary" className={categoryColors[article.metadata.category]}>
                    {article.metadata.category}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{article.metadata?.author}</TableCell>
              <TableCell>
                {new Date(article.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {article.metadata?.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDownload(article.path)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteArticle(article.path)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 