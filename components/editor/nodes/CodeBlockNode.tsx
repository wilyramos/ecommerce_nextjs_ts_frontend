// File: frontend/components/editor/nodes/CodeBlockNode.tsx
import {
    ElementNode,
    NodeKey,
    SerializedElementNode,
    Spread,
    DOMConversionMap,
    DOMConversionOutput,
    LexicalNode,
} from "lexical";

export type SerializedCodeBlockNode = Spread<
  {
    language: string;
  },
  SerializedElementNode
>;

export const SUPPORTED_LANGUAGES = [
  "plaintext",
  "javascript",
  "typescript",
  "html",
  "css",
  "python",
  "sql",
  "bash"
];



export class CodeBlockNode extends ElementNode {
  __language: string;

  static getType(): string {
    return "code-block";
  }

  static clone(node: CodeBlockNode): CodeBlockNode {
    return new CodeBlockNode(node.__language, node.__key);
  }

  constructor(language: string, key?: NodeKey) {
    super(key);
    this.__language = language;
  }

  createDOM(): HTMLElement {
    const pre = document.createElement("pre");
    pre.className = "bg-muted text-muted-foreground p-4 rounded-lg font-mono text-sm overflow-x-auto my-4 border border-border/40";
    const code = document.createElement("code");
    code.className = `language-${this.__language}`;
    pre.appendChild(code);
    return pre;
  }

  updateDOM(): false {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      pre: () => ({
        conversion: (domNode: Node): DOMConversionOutput | null => {
          if (domNode instanceof HTMLPreElement) {
            const codeChild = domNode.querySelector("code");
            let lang = "javascript";
            if (codeChild) {
              const className = codeChild.className;
              const match = className.match(/language-(\w+)/);
              if (match) lang = match[1];
            }
            return { node: $createCodeBlockNode(lang) };
          }
          return null;
        },
        priority: 1,
      }),
    };
  }

  exportDOM(): { element: HTMLElement } {
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = `language-${this.__language}`;
    pre.appendChild(code);
    return { element: pre };
  }

  exportJSON(): SerializedCodeBlockNode {
    return {
      ...super.exportJSON(),
      language: this.__language,
      type: "code-block",
      version: 1,
    };
  }

  static importJSON(json: SerializedCodeBlockNode): CodeBlockNode {
    return new CodeBlockNode(json.language);
  }
}

export function $createCodeBlockNode(language: string): CodeBlockNode {
  return new CodeBlockNode(language);
}

export function $isCodeBlockNode(node: LexicalNode | null | undefined): node is CodeBlockNode {
  return node instanceof CodeBlockNode;
}