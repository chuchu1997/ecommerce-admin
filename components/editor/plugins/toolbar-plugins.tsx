"use client";
import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Toggle } from "@/components/ui/toggle";
import { BoldIcon, ItalicIcon, UnderlineIcon, Loader2Icon } from "lucide-react";
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";

import { $isListNode, ListNode } from "@lexical/list";

import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import BlockTypeDropdown from "./components/block-type-dropdown";
import { blockTypeToBlockName } from "./components/block-types";

const ToolbarPlugins = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);

  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      const anchorNode = selection.anchor.getNode();

      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementDOM = editor.getElementByKey(element.getKey());

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      })
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor]);
  return (
    <div className="w-full p-1 border-b z-10">
      <div className="flex space-x-2 justify-center">
        <Button
          className="h-8 px-2"
          variant={"ghost"}
          disabled={!canUndo}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        >
          {/* reload flip to left */}
          <Loader2Icon className="transform -scale-x-100" />
        </Button>

        <Button
          className="h-8 px-2"
          variant={"ghost"}
          disabled={!canRedo}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        >
          <Loader2Icon />
        </Button>
        <Separator orientation="vertical" className="h-auto my-1" />

        <Toggle
          area-label="Bold"
          size="sm"
          pressed={isBold}
          onPressedChange={(pressed) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            setIsBold(pressed);
          }}
        >
          <BoldIcon />
        </Toggle>

        <Toggle
          area-label="Italic"
          size="sm"
          pressed={isItalic}
          onPressedChange={(pressed) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            setIsItalic(pressed);
          }}
        >
          <ItalicIcon />
        </Toggle>

        <Toggle
          area-label="Underline"
          size="sm"
          pressed={isUnderline}
          onPressedChange={(pressed) => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            setIsUnderline(pressed);
          }}
        >
          <UnderlineIcon />
        </Toggle>

        <BlockTypeDropdown blockType={blockType} />
      </div>
    </div>
  );
};

export default ToolbarPlugins;
