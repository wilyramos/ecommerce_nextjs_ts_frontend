"use client";

import { useState, useEffect } from "react";
import {
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
    UNDO_COMMAND,
    REDO_COMMAND,
    type TextFormatType, // ✅ importa el tipo correcto
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Bold, Italic, Undo2, Redo2 } from "lucide-react";

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const [activeFormats, setActiveFormats] = useState<TextFormatType[]>([]); // ✅ tipado

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const formats: TextFormatType[] = [];
                    (["bold", "italic"] as TextFormatType[]).forEach((f) => {
                        if (selection.hasFormat(f)) formats.push(f);
                    });
                    setActiveFormats(formats);
                }
            });
        });
    }, [editor]);

    const isActive = (format: TextFormatType) =>
        activeFormats.includes(format) ? "bg-gray-300" : "hover:bg-gray-200";

    const btn = "p-1 w-8 h-8 flex items-center justify-center rounded border";

    return (
        <div className="flex gap-1 border-b bg-gray-50 p-1">
            {/* Undo / Redo */}
            <button
                type="button"
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                className={btn}
            >
                <Undo2 size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                className={btn}
            >
                <Redo2 size={16} />
            </button>

            {/* Bold / Italic */}
            <button
                type="button"
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold" as TextFormatType)
                }
                className={`${btn} ${isActive("bold")}`}
            >
                <Bold size={16} />
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic" as TextFormatType)
                }
                className={`${btn} ${isActive("italic")}`}
            >
                <Italic size={16} />
            </button>
        </div>
    );
}