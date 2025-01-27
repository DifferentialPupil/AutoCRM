import { Metadata } from "next"
import { KnowledgeBaseTable } from "@/components/knowledge/knowledge-base-table"
import { UploadArticle } from "@/components/knowledge/upload-article"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: 'Knowledge Base',
  description: 'Browse and manage knowledge base articles',
}

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>
                <p className="text-muted-foreground">
                    Browse and manage knowledge base articles
                </p>
            </div>

            <UploadArticle>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Article
                </Button>
            </UploadArticle>
        </div>
    
        <div className="space-y-4">
            <KnowledgeBaseTable />
        </div>
    </div>
  )
} 