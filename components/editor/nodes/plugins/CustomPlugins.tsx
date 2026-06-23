"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { $createImageNode } from "@/components/editor/nodes/ImageNode";
import { $createVideoNode } from "@/components/editor/nodes/VideoNode";

export function DragDropPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
              editor.update(() => {
                if (file.type.startsWith("image/")) {
                  $insertNodes([$createImageNode(result, file.name)]);
                } else if (file.type.startsWith("video/")) {
                  $insertNodes([$createVideoNode(result, file.name)]);
                }
              });
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

    rootElement.addEventListener("dragover", handleDragOver);
    rootElement.addEventListener("drop", handleDrop);

    return () => {
      rootElement.removeEventListener("dragover", handleDragOver);
      rootElement.removeEventListener("drop", handleDrop);
    };
  }, [editor]);

  return null;
}

export function AutoLinkPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      // Manejado nativamente por LexicalAutoLinkPlugin
    });
  }, [editor]);

  return null;
}

export function CleanPastePlugin(): null {
  return null;
}

interface EditorStatsPluginProps {
  onStatsChange: (stats: { words: number; characters: number; paragraphs: number }) => void;
}

export function EditorStatsPlugin({ onStatsChange }: EditorStatsPluginProps): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        // Implementación simplificada de conteo básico
        const text = editor.getRootElement()?.innerText || "";
        const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
        const characters = text.length;
        const paragraphs = text.split(/\n+/).filter(p => p.trim() !== "").length;
        onStatsChange({ words, characters, paragraphs });
      });
    });
  }, [editor, onStatsChange]);

  return null;
}

export function KeyboardShortcutsPlugin(): null {
  return null;
}

export function FindReplacePlugin(): null {
  return null;
}