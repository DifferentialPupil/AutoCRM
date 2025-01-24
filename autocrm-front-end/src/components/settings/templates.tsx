'use client';

import { useState } from 'react';
import { useTemplateStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Template } from '@/types/schema';
import { useAuthStore } from '@/lib/store';

interface TemplateFormData {
  name: string;
  content: string | null;
  category: 'support' | 'sales' | 'general';
}

const initialFormData: TemplateFormData = {
  name: '',
  content: '',
  category: 'general'
};

export function TemplateModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TemplateFormData>(initialFormData);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { user } = useAuthStore();
  const { 
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    fetchTemplates 
  } = useTemplateStore();

  // Fetch templates when modal opens
  const handleOpen = async () => {
    setOpen(true);
    await fetchTemplates();
  };

  // Reset form when modal closes
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setSelectedTemplate(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      if (selectedTemplate) {
        // Update existing template
        await updateTemplate(selectedTemplate.id, {
          name: formData.name,
          content: formData.content,
        });
      } else {
        // Create new template
        await createTemplate({
          name: formData.name,
          content: formData.content,
          user_id: user.id
        });
      }
      handleClose();
    } catch (err) {
      console.error('Failed to save template:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;
    
    try {
      await deleteTemplate(selectedTemplate.id);
      handleClose();
    } catch (err) {
      console.error('Failed to delete template:', err);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      content: template.content,
      category: 'general' // You might want to add category to your template schema
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpen}>
          Manage Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{selectedTemplate ? 'Edit Template' : 'Create Template'}</DialogTitle>
          <DialogDescription>
            {selectedTemplate 
              ? "Edit your response template below. Click save when you're done."
              : "Templates may include variables like \"{customer_name}\"."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="Template name"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: 'support' | 'sales' | 'general') => 
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Support Responses</SelectItem>
                  <SelectItem value="sales">Sales Responses</SelectItem>
                  <SelectItem value="general">General Responses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="col-span-3"
                placeholder="Template content..."
                rows={8}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <DialogFooter className="flex justify-between">
            {selectedTemplate && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete Template
              </Button>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Template'}
              </Button>
            </div>
          </DialogFooter>
        </form>

        {templates.length > 0 && !selectedTemplate && (
          <div className="mt-6">
            <h4 className="mb-4 text-sm font-medium">Existing Templates</h4>
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <span>{template.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
