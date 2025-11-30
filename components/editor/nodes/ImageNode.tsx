import React from "react";
import {
  DecoratorNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

type SerializedImageNode = Spread<
  {
    src: string;
    alt: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __alt: string;

  static getType() {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  constructor(src: string, alt: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  createDOM() {
    return document.createElement("div");
  }

  updateDOM() {
    return false;
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

  decorate() {
    return React.createElement("img", {
      src: this.__src,
      alt: this.__alt,
      className: "max-w-full my-3 rounded",
    });
  }
}

export function $createImageNode(src: string, alt: string) {
  return new ImageNode(src, alt);
}
