'use client'
import { $insertNodes, COMMAND_PRIORITY_NORMAL, createCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $createInlineImageNode } from "../../nodes/InlineImageNode";

export const INSERT_INLINE_IMAGE_COMMAND = createCommand<void>();

export function insertInlineImage() {
  const imageNode = $createInlineImageNode(
    "https://noithatcaco.vn/uploads/product/thumb/tu-giay-dep-go-mdf-ket-hop-tu-dung-do-da-nang-ben-bi-tg058-0123456789.jpg",
    "Example Image",
    100,
    100
  );
  $insertNodes([imageNode]);
}

export function InlineImagePlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    console.log("[InlineImagePlugin] Registered INSERT_INLINE_IMAGE_COMMAND");
    return editor.registerCommand(
      INSERT_INLINE_IMAGE_COMMAND,
      () => {
        console.log("[InlineImagePlugin] Command triggered");
        editor.update(() => {
          insertInlineImage();
        });
        return true;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor]);


  return null; // Không hiển thị gì, chỉ dùng để đăng ký command
}