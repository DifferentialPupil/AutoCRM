"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTemplateStore } from "@/lib/store";

// props
interface NotesInputProps {
    handleAddNote: (newNote: string) => void;
}

export function NotesInput({ handleAddNote }: NotesInputProps) {
    const [newNote, setNewNote] = useState("");
    const [template, setTemplate] = useState("");
    const [beginDetected, setBeginDetected] = useState(false);
    const { templates } = useTemplateStore();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            
            const match = newNote.match(/\{[^}]+\}/);
            if (match && match.index !== undefined) {
                const start = match.index;
                const end = start + match[0].length;
                
                // Set selection range to highlight the matched text
                e.currentTarget.setSelectionRange(start, end);
            }
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setNewNote(value);

        if (beginDetected) {
            setTemplate(template + value[value.length - 1]);
        }

        if (value[value.length - 1] === '.') {
            setTemplate("");
            setBeginDetected(true);
        }

        if (value[value.length - 1] === ' ') {
            setTemplate("");
            setBeginDetected(false);
        }

        templates.forEach(t => {
            if (t.name.toLowerCase().replace(/\s+/g, '') === template.toLowerCase()) {
                setNewNote(t.content || "");
            }
        });
    };

    const addNote = () => {
        handleAddNote(newNote);
        setNewNote("");
    }

    return (
    <>
        <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            />
        <Button onClick={addNote}>
            Add Note
        </Button>
    </>
    );
}