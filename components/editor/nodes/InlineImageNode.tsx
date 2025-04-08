import {
  DecoratorNode,
  LexicalEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import * as React from "react";

type SerializedInlineImageNode = Spread<
  {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

export class InlineImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;
  __alt: string;
  __width?: number;
  __height?: number;

  static getType(): string {
    return "inline-image";
  }

  static clone(node: InlineImageNode): InlineImageNode {
    return new InlineImageNode(
      node.__src,
      node.__alt,
      node.__width,
      node.__height,
      node.__key
    );
  }

  constructor(
    src: string,
    alt: string,
    width?: number,
    height?: number,
    key?: string
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__height = height;
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.JSX.Element {
    return (
      <img
        src={this.__src}
        alt={this.__alt}
        width={this.__width}
        height={this.__height}
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          maxWidth: "100%",
        }}
      />
    );
  }

  static importJSON(serializedNode: SerializedInlineImageNode): InlineImageNode {
    const { src, alt, width, height } = serializedNode;
    return new InlineImageNode(src, alt, width, height);
  }

  exportJSON(): SerializedInlineImageNode {
    return {
      type: "inline-image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height,
    };
  }

  isInline(): boolean {
    return true;
  }
}

export function $createInlineImageNode(
  src: string,
  alt: string,
  width?: number,
  height?: number
): InlineImageNode {
  return new InlineImageNode(src, alt, width, height);
}

export function $isInlineImageNode(node: unknown): node is InlineImageNode {
  return node instanceof InlineImageNode;
}