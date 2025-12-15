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
import { ImageNode } from "@/components/editor/nodes/ImageNode";
import Toolbar from "./Toolbar";
import EditorTheme from "@/components/form/editor/EditorTheme";

const editorConfig: InitialConfigType = {
    namespace: "EcommerceEditor",
    theme: EditorTheme,
    onError(error) { throw error; },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, TableNode, TableCellNode, TableRowNode, LinkNode, ImageNode],
};

/**
 * 🛠️ DOM Preprocessor V2 (Type Safe)
 * Utiliza getPropertyValue y setProperty para evitar errores de índice en TS.
 */
const moveStylesToSpans = (dom: Document) => {
    const doc = dom;

    // Lista de propiedades CSS. Usamos kebab-case (ej: background-color) que funciona con getPropertyValue
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

        // getPropertyValue devuelve string vacío si no existe, lo cual es falsy
        const hasStyles = stylesToTransfer.some(style => el.style.getPropertyValue(style));

        if (hasStyles) {
            const childNodes = Array.from(el.childNodes);

            if (childNodes.length === 0) return;

            childNodes.forEach(child => {
                // Caso 1: Es Texto -> Envolver en Span
                if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
                    const span = doc.createElement('span');
                    span.textContent = child.textContent;

                    // Copiar estilos usando la API estándar
                    stylesToTransfer.forEach(style => {
                        const val = el.style.getPropertyValue(style);
                        if (val) {
                            span.style.setProperty(style, val);
                        }
                    });

                    el.replaceChild(span, child);
                }
                // Caso 2: Es otro Elemento HTML -> Fusionar estilos
                else if (child instanceof HTMLElement) {
                    stylesToTransfer.forEach(style => {
                        const parentVal = el.style.getPropertyValue(style);
                        const childVal = child.style.getPropertyValue(style);

                        // Solo aplicamos si el padre tiene valor y el hijo NO (la cascada gana)
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

export default function ProductDescriptionEditor({ initialHTML = "" }) {
    const [html, setHtml] = useState(initialHTML);
    const [isHTMLMode, setIsHTMLMode] = useState(false);

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <input type="hidden" name="descripcion" value={html} />

            <LexicalComposer initialConfig={editorConfig}>
                <Toolbar onToggleHTML={() => setIsHTMLMode(m => !m)} isHTMLMode={isHTMLMode} />

                {isHTMLMode ? (
                    <textarea
                        className="w-full h-[400px] p-4 font-mono text-xs bg-slate-50 border-t outline-none resize-none text-slate-800"
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                    />
                ) : (
                    <div className="relative">
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable
                                    className="min-h-[300px] max-h-[600px] overflow-y-auto p-6 outline-none prose max-w-none"
                                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                                />
                            }
                            placeholder={<div className="absolute top-6 left-6 text-gray-400 pointer-events-none select-none">Escribe una descripción detallada...</div>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <InitialHTMLPlugin html={initialHTML} />
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