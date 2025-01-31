'use client'

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useKnowledgeBaseStore } from "@/lib/store"
import { ArticleCategory, ArticleMetadata } from "@/types/schema"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { uploadFile as uploadFileToVectorStore } from "@/lib/vector-store";

interface UploadArticleProps {
  children: React.ReactNode
}

export function UploadArticle({ children }: UploadArticleProps) {
  const { uploadArticle } = useKnowledgeBaseStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<Partial<ArticleMetadata>>({
    title: '',
    description: '',
    category: 'general',
    tags: [],
    author: '',
    published: false,
    version: '1.0.0'
  })

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMetadata(prev => ({
        ...prev,
        title: selectedFile.name.replace(/\.[^/.]+$/, '') // Remove file extension
      }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    try {
        await uploadArticle(file, metadata)
        uploadFileToVectorStore(file, metadata)

        toast({
            title: "Success",
            description: "Article uploaded successfully",
        })
        setOpen(false)
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to upload article: " + error,
            variant: "destructive",
        })
    } finally {
        setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Article</DialogTitle>
          <DialogDescription>
            Upload a new article to the knowledge base
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".md,.mdx,.txt,.pdf"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={metadata.title}
              onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={metadata.description}
              onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={metadata.category}
              onValueChange={(value: ArticleCategory) => 
                setMetadata(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="faq">FAQ</SelectItem>
                <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={metadata.tags?.join(', ')}
              onChange={(e) => setMetadata(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={metadata.author}
              onChange={(e) => setMetadata(prev => ({ ...prev, author: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={metadata.version}
              onChange={(e) => setMetadata(prev => ({ ...prev, version: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}