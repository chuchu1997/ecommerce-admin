import {
  DecoratorNode,
  LexicalEditor,
  SerializedLexicalNode,
} from "lexical";
import * as React from "react";

export type SerializedInlineImageNode = {
  url: string;
  altText: string;
  width: number;
  height: number;
  position: "left" | "right" | "full";
  type: string;
  version: 1;
} & SerializedLexicalNode;

export class InlineImageNode extends DecoratorNode<React.JSX.Element> {
  __url: string;
  __altText: string;
  __width: number;
  __height: number;
  __position: "left" | "right" | "full";

  static getType(): string {
    return "inline-image";
  }

  static clone(node: InlineImageNode): InlineImageNode {
    return new InlineImageNode(
      node.__url,
      node.__altText,
      node.__width,
      node.__height,
      node.__position,
      node.__key
    );
  }

  constructor(
    url: string,
    altText: string,
    width: number,
    height: number,
    position: "left" | "right" | "full",
    key?: string
  ) {
    super(key);
    this.__url = url;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
    this.__position = position;
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    return span;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): React.JSX.Element {
    return (
      <img
        src={this.__url}
        alt={this.__altText}
        width={this.__width}
        height={this.__height}
        style={{
          float:
            this.__position === "left"
              ? "left"
              : this.__position === "right"
              ? "right"
              : "none",
          display: "block",
          margin: "8px 0",
          maxWidth: "100%",
        }}
      />
    );
  }

  static importJSON(serializedNode: SerializedInlineImageNode): InlineImageNode {
    const { url, altText, width, height, position } = serializedNode;
    return new InlineImageNode(url, altText, width, height, position);
  }

  exportJSON(): SerializedInlineImageNode {
    return {
      type: "inline-image",
      version: 1,
      url: this.__url,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      position: this.__position,
    };
  }
}

export function $createInlineImageNode(
  url: string,
  altText: string,
  width: number,
  height: number,
  position: "left" | "right" | "full"
): InlineImageNode {
  return new InlineImageNode(url, altText, width, height, position);
}