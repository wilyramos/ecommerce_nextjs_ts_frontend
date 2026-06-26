// File: frontend/components/admin/products/ProductDescriptionEditor.tsx
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
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";
import { LinkNode } from "@lexical/link";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";

// IMPORTACIÓN ESTÁNDAR ÚNICA MEDIANTE ALIAS
import { ImageNode, $createImageNode } from "@/components/editor/nodes/ImageNode";
import Toolbar from "@/components/admin/products/Toolbar";
import EditorTheme from "@/components/form/editor/EditorTheme";

const editorConfig: InitialConfigType = {
    namespace: "EcommerceEditor",
    theme: EditorTheme,
    onError(error) { throw error; },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, TableNode, TableCellNode, TableRowNode, LinkNode, ImageNode],
};

const moveStylesToSpans = (dom: Document) => {
    const doc = dom;
    const stylesToTransfer = [
        'color',
        'background-color',
        'font-size',
        'font-family',
        'font-weight',
        'text-align'
    ];

    const elements = doc.querySelectorAll('*');
    elements.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        const hasStyles = stylesToTransfer.some(style => el.style.getPropertyValue(style));

        if (hasStyles) {
            const childNodes = Array.from(el.childNodes);
            if (childNodes.length === 0) return;

            childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
                    const span = doc.createElement('span');
                    span.textContent = child.textContent;

                    stylesToTransfer.forEach(style => {
                        const val = el.style.getPropertyValue(style);
                        if (val) span.style.setProperty(style, val);
                    });
                    el.replaceChild(span, child);
                }
                else if (child instanceof HTMLElement) {
                    stylesToTransfer.forEach(style => {
                        const parentVal = el.style.getPropertyValue(style);
                        const childVal = child.style.getPropertyValue(style);
                        if (parentVal && !childVal) {
                            child.style.setProperty(style, parentVal);
                        }
                    });
                }
            });
        }
    });
    return doc;
};

function InitialHTMLPlugin({ html }: { html: string }) {
    const [editor] = useLexicalComposerContext();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!html || isLoaded) return;

        editor.update(() => {
            const root = $getRoot();
            if (root.getTextContentSize() === 0) {
                const parser = new DOMParser();
                let dom = parser.parseFromString(html, "text/html");
                dom = moveStylesToSpans(dom);

                const nodes = $generateNodesFromDOM(editor, dom);
                root.clear();
                $insertNodes(nodes);
            }
        });
        setIsLoaded(true);
    }, [html, editor, isLoaded]);

    return null;
}

interface MediaInsertionPluginProps {
    urlsToInsert: string[];
    onClearUrls: () => void;
}

function MediaInsertionPlugin({ urlsToInsert, onClearUrls }: MediaInsertionPluginProps) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (urlsToInsert.length === 0) return;

        editor.update(() => {
            const nodes = urlsToInsert.map(url => $createImageNode(url, "Imagen insertada"));
            $insertNodes(nodes);
        });

        onClearUrls();
    }, [urlsToInsert, editor, onClearUrls]);

    return null;
}

export default function ProductDescriptionEditor({ initialHTML = "" }) {
    const [html, setHtml] = useState(initialHTML);
    const [isHTMLMode, setIsHTMLMode] = useState(false);
    const [pendingUrls, setPendingUrls] = useState<string[]>([]);
    const [resetKey, setResetKey] = useState(0);

    const handleMediaChange = (urls: string[]) => {
        if (urls.length > 0) {
            setPendingUrls(urls);
        }
    };

    const handleClearUrls = () => {
        setPendingUrls([]);
        setResetKey(prev => prev + 1);
    };

    return (
        <div className="w-full border border-border/60 rounded-sm overflow-hidden bg-background text-foreground">
            <input type="hidden" name="descripcion" value={html} />

            <LexicalComposer initialConfig={editorConfig}>
                <div className="flex items-center justify-between border-b border-border/40 bg-background w-full">
                    <Toolbar 
                        onToggleHTML={() => setIsHTMLMode(m => !m)} 
                        isHTMLMode={isHTMLMode} 
                        mediaResetKey={resetKey}
                        onMediaChange={handleMediaChange}
                    />
                </div>

                {isHTMLMode ? (
                    <textarea
                        className="w-full h-[320px] p-4 font-mono text-xs bg-background-secondary border-t border-border/40 text-foreground outline-none resize-none overflow-y-auto"
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                    />
                ) : (
                    <div className="relative border-t border-border/40 h-[320px]">
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable
                                    className="h-full overflow-y-auto p-4 md:p-5 outline-none prose prose-sm max-w-none dark:prose-invert"
                                />
                            }
                            placeholder={
                                <div className="absolute top-4 left-4 md:top-5 md:left-5 text-xs text-muted-foreground/50 pointer-events-none select-none font-medium">
                                    Escribe una descripción detallada...
                                </div>
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <InitialHTMLPlugin html={initialHTML} />
                        <MediaInsertionPlugin urlsToInsert={pendingUrls} onClearUrls={handleClearUrls} />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <ListPlugin />
                        <TablePlugin />
                        <OnChangePlugin onChange={(editorState, editor) => {
                            if (!isHTMLMode) {
                                editorState.read(() => {
                                    setHtml($generateHtmlFromNodes(editor));
                                });
                            }
                        }} />
                    </div>
                )}
            </LexicalComposer>
        </div>
    );
}