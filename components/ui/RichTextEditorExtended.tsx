"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes, EditorState } from "lexical";
import { LinkNode } from "@lexical/link";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";

import { ImageNode, $createImageNode } from "@/components/editor/nodes/ImageNode";
import { VideoNode } from "@/components/editor/nodes/VideoNode";
import { CodeBlockNode } from "@/components/editor/nodes/CodeBlockNode";
import ToolbarExtended from "@/components/admin/products/ToolbarExtended";
import EditorThemeExtended from "@/components/editor/EditorThemeExtended";
import {
  DragDropPlugin,
  AutoLinkPlugin,
  CleanPastePlugin,
  EditorStatsPlugin,
  KeyboardShortcutsPlugin,
  FindReplacePlugin
} from "@/components/editor/nodes/plugins/CustomPlugins";

const editorConfig: InitialConfigType = {
  namespace: "EcommerceRichEditorExtended",
  theme: EditorThemeExtended,
  onError(error: Error) {
    console.error("Editor error:", error);
  },
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    LinkNode,
    ImageNode,
    VideoNode,
    CodeBlockNode,
  ],
};

function InitialHTMLPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!html || hasInitialized.current) return;
    hasInitialized.current = true;

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
  }, [html, editor]);

  return null;
}

function MediaInsertionPlugin({
  urlsToInsert,
  onClearUrls,
}: {
  urlsToInsert: string[];
  onClearUrls: () => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (urlsToInsert.length === 0) return;

    editor.update(() => {
      const nodes = urlsToInsert.map((url) => $createImageNode(url, "Imagen insertada"));
      $insertNodes(nodes);
    });

    onClearUrls();
  }, [urlsToInsert, editor, onClearUrls]);

  return null;
}

const moveStylesToSpans = (dom: Document) => {
  const doc = dom;
  const stylesToTransfer = [
    "color",
    "background-color",
    "font-size",
    "font-family",
    "font-weight",
    "text-align",
  ];

  const elements = doc.querySelectorAll("*");
  elements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const hasStyles = stylesToTransfer.some((style) => el.style.getPropertyValue(style));

    if (hasStyles) {
      const childNodes = Array.from(el.childNodes);
      if (childNodes.length === 0) return;

      childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          const span = doc.createElement("span");
          span.textContent = child.textContent;

          stylesToTransfer.forEach((style) => {
            const val = el.style.getPropertyValue(style);
            if (val) span.style.setProperty(style, val);
          });
          el.replaceChild(span, child);
        } else if (child instanceof HTMLElement) {
          stylesToTransfer.forEach((style) => {
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

export interface RichTextEditorExtendedProps {
  initialHTML?: string;
  name: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  onExport?: (html: string) => void;
  showStats?: boolean;
  showToolbar?: boolean;
  minHeight?: string;
  maxHeight?: string;
  readOnly?: boolean;
  disabled?: boolean;
}

export default function RichTextEditorExtended({
  initialHTML = "",
  name,
  placeholder = "Escribe el contenido aquí...",
  onChange,
  onExport,
  showStats = true,
  showToolbar = true,
  minHeight = "320px",
  maxHeight = "600px",
  readOnly = false,
  disabled = false,
}: RichTextEditorExtendedProps) {
  const [html, setHtml] = useState(initialHTML);
  const [isHTMLMode, setIsHTMLMode] = useState(false);
  const [pendingUrls, setPendingUrls] = useState<string[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [editorStats, setEditorStats] = useState({ words: 0, characters: 0, paragraphs: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMediaChange = useCallback((urls: string[]) => {
    if (urls.length > 0) {
      setPendingUrls(urls);
    }
  }, []);

  const handleClearUrls = useCallback(() => {
    setPendingUrls([]);
    setResetKey((prev) => prev + 1);
  }, []);

  const handleHTMLTextareaChange = useCallback(
    (value: string) => {
      setHtml(value);
      if (onChange) onChange(value);
    },
    [onChange]
  );

  const handleEditorChange = useCallback(
    (newHtml: string) => {
      setHtml(newHtml);
      if (onChange) onChange(newHtml);
    },
    [onChange]
  );

  const handleStatsChange = useCallback((stats: { words: number; characters: number; paragraphs: number }) => {
    setEditorStats(stats);
  }, []);

  return (
    <div
      className={`w-full border rounded-lg overflow-hidden bg-background text-foreground shadow-sm transition-all ${
        isFocused ? "border-blue-500 ring-1 ring-blue-200" : "border-border/60"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input type="hidden" name={name} value={html} />

      <LexicalComposer initialConfig={{ ...editorConfig, editable: !readOnly && !disabled }}>
        {showToolbar && !readOnly && !disabled && (
          <ToolbarExtended
            onToggleHTML={() => setIsHTMLMode((m) => !m)}
            isHTMLMode={isHTMLMode}
            mediaResetKey={resetKey}
            onMediaChange={handleMediaChange}
            onExport={onExport}
            showStats={showStats}
          />
        )}

        <div style={{ display: isHTMLMode ? "block" : "none" }}>
          <textarea
            className="w-full p-4 font-mono text-xs bg-muted/10 border-t border-border/40 text-foreground outline-none resize-none focus:ring-1 focus:ring-primary focus:border-transparent"
            value={html}
            onChange={(e) => handleHTMLTextareaChange(e.target.value)}
            style={{ minHeight, maxHeight }}
            disabled={disabled || readOnly}
          />
        </div>

        <div 
          style={{ display: isHTMLMode ? "none" : "block" }}
          className="relative border-t border-border/40"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`outline-none overflow-y-auto p-4 md:p-5 prose prose-sm max-w-none dark:prose-invert ${readOnly ? "cursor-default" : ""}`}
                style={{ minHeight, maxHeight }}
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 md:top-5 md:left-5 text-xs text-muted-foreground/50 pointer-events-none select-none font-medium">
                {placeholder}
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
          <LinkPlugin />
          <DragDropPlugin />
          <AutoLinkPlugin />
          <CleanPastePlugin />
          <KeyboardShortcutsPlugin />
          <FindReplacePlugin />
          {showStats && <EditorStatsPlugin onStatsChange={handleStatsChange} />}

          <OnChangePlugin
            onChange={(editorState: EditorState, editor) => {
              if (!isHTMLMode) {
                editorState.read(() => {
                  const currentHtml = $generateHtmlFromNodes(editor);
                  handleEditorChange(currentHtml);
                });
              }
            }}
          />
        </div>

        {showStats && !isHTMLMode && (
          <div className="border-t border-border/40 bg-muted/20 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex gap-6">
              <span>Palabras: {editorStats.words}</span>
              <span>Caracteres: {editorStats.characters}</span>
              <span>Párrafos: {editorStats.paragraphs}</span>
            </div>
            <span className="text-[10px] opacity-60">v1.0</span>
          </div>
        )}
      </LexicalComposer>
    </div>
  );
}