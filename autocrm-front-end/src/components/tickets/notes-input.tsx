"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTemplateStore } from "@/lib/store";

// props
interface NotesInputProps {
    handleAddNote: (newNote: string) => void;
}

export function NotesInput({ handleAddNote }: NotesInputProps) {
    const [newNote, setNewNote] = useState("");
    const [template, setTemplate] = useState("");
    const [beginDetected, setBeginDetected] = useState(false);
    const { templates, fetchTemplates } = useTemplateStore();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            
            const match = newNote.match(/\{[^}]+\}/);
            if (match && match.index !== undefined) {
                const start = match.index;
                const end = start + match[0].length;
                e.currentTarget.setSelectionRange(start, end);
            }
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(template);
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
            templates.forEach(t => {
                if (t.name.toLowerCase().replace(/\s+/g, '') === template.toLowerCase()) {
                    setNewNote(t.content || "");
                }
            });
            setTemplate("");
            setBeginDetected(false);
        }

        console.log(template);
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