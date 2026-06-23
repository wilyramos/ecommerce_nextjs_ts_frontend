// File: frontend/components/editor/nodes/VideoNode.tsx
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
import { Play } from "lucide-react";

export type SerializedVideoNode = Spread<
  {
    src: string;
    alt: string;
    width: string;
    height: string;
  },
  SerializedLexicalNode
>;

export class VideoNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __alt: string;
  __width: string;
  __height: string;

  static getType(): string {
    return "video";
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__src, node.__alt, node.__width, node.__height, node.__key);
  }

  constructor(
    src: string,
    alt: string = "Video",
    width: string = "100%",
    height: string = "auto",
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__height = height;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "lexical-video-container my-4 block text-center";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      video: () => ({
        conversion: (domNode: Node): DOMConversionOutput | null => {
          if (domNode instanceof HTMLVideoElement) {
            const src = domNode.src || (domNode.querySelector("source")?.getAttribute("src") || "");
            const alt = domNode.title || "Video";
            const nodeOutput = $createVideoNode(src, alt);
            return { node: nodeOutput };
          }
          return null;
        },
        priority: 1,
      }),
    };
  }

  exportDOM(): { element: HTMLElement } {
    const element = document.createElement("video");
    element.setAttribute("src", this.__src);
    element.setAttribute("controls", "true");
    element.setAttribute("width", "100%");
    element.className = "max-w-full my-4 rounded border border-border/40";
    return { element };
  }

  exportJSON(): SerializedVideoNode {
    return {
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height,
      type: "video",
      version: 1,
    };
  }

  static importJSON(json: SerializedVideoNode): VideoNode {
    return new VideoNode(json.src, json.alt, json.width, json.height);
  }

  decorate(): React.ReactElement {
    return (
      <div className="relative my-4 rounded overflow-hidden bg-black/5 border border-border/40 group">
        <video
          src={this.__src}
          className="max-w-full w-full h-auto block"
          controls
          controlsList="nodownload"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/20 pointer-events-none">
          <Play className="w-12 h-12 text-white fill-white" />
        </div>
      </div>
    );
  }
}

export function $createVideoNode(
  src: string,
  alt: string = "Video",
  width: string = "100%",
  height: string = "auto"
): VideoNode {
  return new VideoNode(src, alt, width, height);
}

export function $isVideoNode(node: LexicalNode | null | undefined): node is VideoNode {
  return node instanceof VideoNode;
}