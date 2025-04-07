"use client";

import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import InitialEditorState from "@/lib/editor-state.json";
import ToolbarPlugins from "@/components/editor/plugins/toolbar-plugins";
import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useCallback } from "react";

// ✅ Child component to read editor content
const SaveButton = () => {
  const [editor] = useLexicalComposerContext();

  const handleClick = useCallback(() => {
    editor.getEditorState().read(() => {
      const text = $getRoot().getTextContent();
      console.log("Editor content:", text);
    });
  }, [editor]);

  return (
    <div className="px-8 pb-4">
      <Button onClick={handleClick}>Lưu Nội Dung </Button>
    </div>
  );
};

const EditorComponent: React.FC = () => {
  const config: InitialConfigType = {
    namespace: "lexical-editor",

    theme: {
      text: {
        underline: "underline",
      },
    },

    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
    ],

    editorState: JSON.stringify(InitialEditorState),

    onError: (error) => {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div className="mx-auto relative prose dark:prose-invert flex flex-col mt-10 border shadow rounded-lg">
        {/* Toolbar */}
        <ToolbarPlugins />

        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="focus:outline-none w-full px-8 py-4 h-[500px] overflow-auto relative" />
            }
            placeholder={
              <p className="text-muted-foreground absolute top-0 px-8 py-4 w-full pointer-events-none">
                Enter some text...
              </p>
            }
            ErrorBoundary={() => "Error"}
          />
          <HistoryPlugin />
        </div>

        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

        {/* ✅ Save button inside LexicalComposer */}
        <SaveButton />
      </div>
    </LexicalComposer>
  );
};

export default EditorComponent;
