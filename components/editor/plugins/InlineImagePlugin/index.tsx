"use client";

import {
  $insertNodes,
  COMMAND_PRIORITY_NORMAL,
  createCommand,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $createInlineImageNode } from "../../nodes/InlineImageNode";

export const INSERT_INLINE_IMAGE_COMMAND = createCommand<{
  url: string;
  position: "left" | "right" | "full";
}>();

export function InlineImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_INLINE_IMAGE_COMMAND,
      ({ url, position }) => {
        editor.update(() => {
          const imageNode = $createInlineImageNode(
            url,
            "User Image",
            100,
            100,
            position
          );
          $insertNodes([imageNode]);
        });

        return true;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor]);

  return null;
}