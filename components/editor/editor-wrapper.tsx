

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";



const RichTextWrapper = ({
    onChange,
    value,
  }: {
    onChange?: (val: string) => void;
    value?: string;
  }) => {
    const [editor] = useLexicalComposerContext();
  
    useEffect(() => {
      if (value) {
        const parsed = JSON.parse(value);
        const newEditorState = editor.parseEditorState(parsed);
        editor.setEditorState(newEditorState);
      }
    }, [value, editor]);
  
    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        const json = JSON.stringify(editorState.toJSON());
        onChange?.(json);
      });
    }, [editor, onChange]);
  
    return (
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="min-h-[150px] border rounded-md p-2" />
        }
        placeholder={<div className="p-2 text-muted-foreground">Mô tả...</div>}
            ErrorBoundary={LexicalErrorBoundary as any}
      />
    );
  };