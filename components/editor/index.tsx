/** @format */

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
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import InitialEditorState from "@/lib/editor-state.json";
import ToolbarPlugins from "@/components/editor/plugins/toolbar-plugins";
import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useCallback, useEffect, useState } from "react";
import EmojisPlugin from "./plugins/EmojisPlugin";
import { EmojiNode } from "./nodes/EmojiNode";
import { InlineImageNode } from "./nodes/InlineImageNode";
import { InlineImagePlugin } from "./plugins/InlineImagePlugin";
// ✅ Child component to read editor content
import LinkPlugin from "./plugins/LinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import LinkEditor from "./plugins/LinkEditor";
import { PreventLinkOpenPlugin } from "./plugins/PreventLinkPlugin";
import LoadEditorStatePlugin from "./plugins/LoadStatePlugin";

interface EditorInterface {
  initialEditorState?: string;
  onSave: (content: string) => void;
}

const EditorComponent: React.FC<EditorInterface> = ({
  initialEditorState,
  onSave,
}) => {
  const SaveButton = () => {
    const [editor] = useLexicalComposerContext();
    const handleClick = useCallback(() => {
      editor.update(async () => {
        const editorState = editor.getEditorState();
        const serialized = editorState.toJSON();
        const saveJSONString = JSON.stringify(serialized, null, 2);
        onSave(saveJSONString);
      });
    }, [editor]);

    return (
      <div className="px-8 pb-4">
        <Button onClick={handleClick}>Lưu Nội Dung </Button>
      </div>
    );
  };

  const config: InitialConfigType = {
    namespace: "lexical-editor",

    theme: {
      text: {
        underline: "underline",
      },
      heading: {
        h1: "text-3xl font-bold",
        h2: "text-2xl font-semibold",
        h3: "text-xl font-semibold",
        h4: "text-lg font-medium",
        h5: "text-base font-medium",
        h6: "text-sm font-medium",
      },
      paragraph: "text-base", // optional
      quote: "pl-4 border-l-4 border-gray-300 italic text-gray-600", // optional
      list: {
        ul: "list-disc pl-5",
        ol: "list-decimal pl-5",
        listitem: "mb-1",
      },
      link: "text-blue-600 underline cursor-pointer",
    },

    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
      EmojiNode,
      InlineImageNode,
    ],

    // editorState: JSON.stringify(InitialEditorState),

    onError: (error) => {
      console.error(error);
    },
  };
  const [mounted, setMounted] = useState(false);
  // Handle hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

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
            ErrorBoundary={LexicalErrorBoundary as any}
          />
          <HistoryPlugin />
        </div>
        <InlineImagePlugin />
        <ListPlugin />
        <LinkPlugin />
        <EmojisPlugin />
        <ClickableLinkPlugin />
        <LinkEditor /> {/* Custom component để chỉnh sửa link */}
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        {initialEditorState && (
          <LoadEditorStatePlugin initialEditorState={initialEditorState} />
        )}
        {/* ✅ Save button inside LexicalComposer */}
        <SaveButton />
      </div>
    </LexicalComposer>
  );
};

export default EditorComponent;
