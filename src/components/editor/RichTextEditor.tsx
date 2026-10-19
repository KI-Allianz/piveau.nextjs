"use client";

import * as React from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TiptapEditor = NonNullable<ReturnType<typeof useEditor>>;

interface RichTextEditorProps {
  id?: string;
  value?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
}

interface ToolbarButtonProps {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({
  label,
  pressed = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={pressed ? "secondary" : "ghost"}
      size="icon"
      className="size-8"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function RichTextToolbar({ editor }: { editor: TiptapEditor }) {
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      code: editor.isActive("code"),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      link: editor.isActive("link"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  const handleLinkOpenChange = (open: boolean) => {
    setLinkOpen(open);

    if (open) {
      setLinkUrl(editor.getAttributes("link").href ?? "");
    }
  };

  const applyLink = () => {
    const url = linkUrl.trim();

    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkOpen(false);
      return;
    }

    const href = /^(https?:\/\/|mailto:|tel:|\/)/i.test(url)
      ? url
      : `https://${url}`;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href })
      .run();
    setLinkOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 px-1 py-1">
      <ToolbarButton
        label="Bold"
        pressed={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        pressed={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        pressed={state.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline />
      </ToolbarButton>
      <ToolbarButton
        label="Inline code"
        pressed={state.code}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton
        label="Bullet list"
        pressed={state.bulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </ToolbarButton>
      <ToolbarButton
        label="Ordered list"
        pressed={state.orderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered />
      </ToolbarButton>
      <Popover open={linkOpen} onOpenChange={handleLinkOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={state.link ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            aria-label="Link"
            aria-pressed={state.link}
            onMouseDown={(event) => event.preventDefault()}
          >
            <Link2 />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 space-y-3" align="start">
          <div className="space-y-1">
            <p className="text-sm font-medium">Link URL</p>
            <Input
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyLink();
                }
              }}
              placeholder="https://example.org"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            {state.link && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setLinkOpen(false);
                }}
              >
                Remove
              </Button>
            )}
            <Button type="button" size="sm" onClick={applyLink}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton
        label="Undo"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  id,
  value,
  placeholder,
  onChange,
  onBlur,
  invalid = false,
}: RichTextEditorProps) {
  const onChangeRef = React.useRef(onChange);
  const onBlurRef = React.useRef(onBlur);
  const lastEmittedHtml = React.useRef(value ?? "");

  React.useEffect(() => {
    onChangeRef.current = onChange;
    onBlurRef.current = onBlur;
  }, [onChange, onBlur]);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: true,
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "",
      }),
    ],
    content: value ?? "",
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        "aria-invalid": invalid ? "true" : "false",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? "" : editor.getHTML();
      lastEmittedHtml.current = html;
      onChangeRef.current?.(html);
    },
    onBlur: () => onBlurRef.current?.(),
  });

  React.useEffect(() => {
    if (!editor) return;

    const incoming = value ?? "";
    if (incoming === lastEmittedHtml.current) return;

    const current = editor.isEmpty ? "" : editor.getHTML();
    if (incoming === current) {
      lastEmittedHtml.current = incoming;
      return;
    }

    editor.commands.setContent(incoming, { emitUpdate: false });
    lastEmittedHtml.current = incoming;
  }, [editor, value]);

  return (
    <div
      className={cn(
        "rich-text-editor overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        invalid &&
          "border-destructive ring-destructive/20 dark:ring-destructive/40",
      )}
    >
      {editor && <RichTextToolbar editor={editor} />}
      {editor ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="min-h-32" />
      )}
    </div>
  );
}
