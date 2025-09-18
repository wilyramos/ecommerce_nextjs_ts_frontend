"use client";

import { useState, useEffect } from "react";
import { LexicalComposer, InitialConfigType } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";
import { LinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import Toolbar from "./Toolbar";

const editorConfig: InitialConfigType = {
    namespace: "EcommerceEditor",
    onError(error) {
        throw error;
    },
    nodes: [LinkNode],
};

function InitialHTMLPlugin({ html }: { html: string }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!html) return;
        editor.update(() => {
            const dom = new DOMParser().parseFromString(html, "text/html");
            const nodes = $generateNodesFromDOM(editor, dom);
            const root = $getRoot();
            root.clear();
            root.append(...nodes);
        });
    }, [editor, html]);

    return null;
}

export default function ProductDescriptionEditor({
    initialHTML = "",
}: {
    initialHTML?: string;
}) {
    const [html, setHtml] = useState(initialHTML);

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            <LexicalComposer initialConfig={editorConfig}>
                <input type="hidden" name="descripcion" value={html} />

                <Toolbar />

                <RichTextPlugin
                    contentEditable={
                        <ContentEditable className=" min-h-[200px] p-3 outline-none prose max-w-none" />
                    }
                    placeholder={<div className="text-gray-400 p-3">Escribe la descripción...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />

                <HistoryPlugin />
                <AutoFocusPlugin />
                <InitialHTMLPlugin html={initialHTML} />

                <OnChangePlugin
                    onChange={(editorState, editor) => {
                        editorState.read(() => {
                            setHtml($generateHtmlFromNodes(editor));
                        });
                    }}
                />
            </LexicalComposer>
        </div>
    );
}
