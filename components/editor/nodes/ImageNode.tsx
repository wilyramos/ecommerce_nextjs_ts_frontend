// File: frontend/components/editor/nodes/ImageNode.tsx
import React from "react";
import {
  DecoratorNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  DOMConversionMap,
  DOMConversionOutput,
  LexicalNode,
} from "lexical";

export type SerializedImageNode = Spread<
  {
    src: string;
    alt: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __alt: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  constructor(src: string, alt: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "lexical-image-container my-3 block text-center";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (domNode: Node): DOMConversionOutput | null => {
          if (domNode instanceof HTMLImageElement) {
            const { src, alt } = domNode;
            const nodeOutput = $createImageNode(src, alt);
            return { node: nodeOutput };
          }
          return null;
        },
        priority: 1,
      }),
    };
  }

  exportDOM(): { element: HTMLElement } {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__alt);
    element.className = "max-w-full my-3 rounded mx-auto block";
    return { element };
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      alt: this.__alt,
      type: "image",
      version: 1,
    };
  }

  static importJSON(json: SerializedImageNode): ImageNode {
    return new ImageNode(json.src, json.alt);
  }

  decorate(): React.ReactElement {
    return React.createElement("img", {
      src: this.__src,
      alt: this.__alt,
      className: "max-w-full my-3 rounded inline-block shadow-sm border border-border/40",
    });
  }
}

export function $createImageNode(src: string, alt: string): ImageNode {
  return new ImageNode(src, alt);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}