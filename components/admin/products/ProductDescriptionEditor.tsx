"use client";

import { useState, useEffect } from "react";
import { LexicalComposer, InitialConfigType } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";

import { LinkNode } from "@lexical/link";
import { ImageNode } from "@/components/editor/nodes/ImageNode";

import Toolbar from "./Toolbar";

const editorConfig: InitialConfigType = {
    namespace: "EcommerceEditor",
    onError(error) {
        throw error;
    },
    nodes: [LinkNode, ImageNode],
};

function InitialHTMLPlugin({ html }: { html: string }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!html) return;

        editor.update(() => {
            const parser = new DOMParser();
            const dom = parser.parseFromString(html, "text/html");
            const nodes = $generateNodesFromDOM(editor, dom);
            const root = $getRoot();
            root.clear();
            $insertNodes(nodes);
        });
    }, [html, editor]);

    return null;
}

export default function ProductDescriptionEditor({ initialHTML = "" }) {

    const [html, setHtml] = useState(initialHTML);
    const [isHTMLMode, setIsHTMLMode] = useState(false);

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">

            <input type="hidden" name="descripcion" value={html} />

            <LexicalComposer initialConfig={editorConfig}>

                <Toolbar
                    onToggleHTML={() => setIsHTMLMode(m => !m)}
                    isHTMLMode={isHTMLMode}
                />

                {/* MODO HTML */}
                {isHTMLMode ? (
                    <textarea
                        className="w-full h-64 p-3 font-mono text-xs border-t outline-none"
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                    />
                ) : (
                    <>
                        <RichTextPlugin
                            contentEditable={<ContentEditable className="min-h-[200px] p-3 outline-none prose max-w-none" />}
                            placeholder={<div className="text-gray-400 p-3">Escribe la descripción...</div>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />

                        <InitialHTMLPlugin html={html} />
                        <HistoryPlugin />
                        <AutoFocusPlugin />

                        <OnChangePlugin
                            onChange={(editorState, editor) => {
                                if (!isHTMLMode) {
                                    editorState.read(() => {
                                        setHtml($generateHtmlFromNodes(editor));
                                    });
                                }
                            }}
                        />
                    </>
                )}

            </LexicalComposer>

        </div>
    );
}
