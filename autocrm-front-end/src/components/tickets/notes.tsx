"use client";

import { InternalNote } from "@/types/schema";
import { useNotesStore } from "@/lib/store";

export function Notes() {
    const { notes, error } = useNotesStore();
    if (error) return <div className="flex justify-center items-center h-full">Error: {error}</div>;

    return (
        <div className="h-[calc(100vh-35rem)] overflow-y-auto space-y-3 pr-2">
            {notes.map((note: InternalNote) => (
                <div key={note.id} className="bg-muted p-3 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{note.note_content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                    Added by {note.user_id} on {new Date(note.created_at).toLocaleString()}
                </p>
                </div>
            ))}
            
        </div>
    );
}

// function LoadingNote() {
//     return (
//         <div className="bg-muted p-3 rounded-md h-20">
//             <div className="flex justify-center items-center h-full">
//                 <Loader2 className="animate-spin" />
//             </div>
//         </div>
//     );
// }