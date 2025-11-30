"use client";

import { useState, useEffect } from "react";
import {
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
    UNDO_COMMAND,
    REDO_COMMAND,
    type TextFormatType,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { Bold, Italic, Undo2, Redo2, Image as ImageIcon, Code } from "lucide-react";
import { $createImageNode } from "@/components/editor/nodes/ImageNode";

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Toolbar({ onToggleHTML, isHTMLMode }: {
    onToggleHTML: () => void;
    isHTMLMode: boolean;
}) {

    const [editor] = useLexicalComposerContext();
    const [activeFormats, setActiveFormats] = useState<TextFormatType[]>([]);
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

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

    const insertImage = () => {
        if (!imageUrl.trim()) return;

        editor.update(() => {
            const node = $createImageNode(imageUrl, "image");
            const selection = $getSelection();
            if ($isRangeSelection(selection)) selection.insertNodes([node]);
        });

        setImageUrl("");
        setOpen(false);
    };

    return (
        <div className="flex gap-1 border-b bg-gray-50 p-1">

            {/* Toggle HTML */}
            <button
                type="button"
                className={btn + " " + (isHTMLMode ? "bg-yellow-200" : "")}
                onClick={onToggleHTML}
            >
                <Code size={16} />
            </button>

            {/* Undo */}
            <button type="button" className={btn} onClick={() =>
                editor.dispatchCommand(UNDO_COMMAND, undefined)
            }>
                <Undo2 size={16} />
            </button>

            {/* Redo */}
            <button type="button" className={btn} onClick={() =>
                editor.dispatchCommand(REDO_COMMAND, undefined)
            }>
                <Redo2 size={16} />
            </button>

            {/* Bold */}
            <button type="button" className={`${btn} ${isActive("bold")}`}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
            >
                <Bold size={16} />
            </button>

            {/* Italic */}
            <button type="button" className={`${btn} ${isActive("italic")}`}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
            >
                <Italic size={16} />
            </button>

            {/* Insert Image with Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button type="button" className={btn}>
                        <ImageIcon size={16} />
                    </button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Añadir imagen</DialogTitle>
                        <DialogDescription>
                            Introduce la URL de la imagen que deseas insertar.
                        </DialogDescription>
                    </DialogHeader>

                    <Input
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancelar</Button>
                        </DialogClose>

                        <Button onClick={insertImage}>
                            Insertar imagen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
