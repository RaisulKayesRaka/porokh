"use client"

import * as React from "react"
import { useEditor, EditorContent, type Editor, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import Mathematics from "@tiptap/extension-mathematics"
import ImageExtension from "@tiptap/extension-image"
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Undo,
  Redo,
  Underline as UnderlineIcon,
  Highlighter,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Code,
  CodeXml,
  Sigma,
  Trash,
  Link,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import { type Node as ProsemirrorNode } from "@tiptap/pm/model"

interface CustomImageNodeProps {
  node: ProsemirrorNode;
  deleteNode: () => void;
  editor: Editor;
}

const CustomImageNode = ({ node, deleteNode, editor }: CustomImageNodeProps) => {
  return (
    <NodeViewWrapper className="relative group inline-block max-w-full my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={node.attrs.src} alt={node.attrs.alt} className="max-w-full max-h-87.5 object-contain rounded-md border " />
      {editor.isEditable && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 "
          onClick={() => deleteNode()}
        >
          <Trash className="size-4" />
        </Button>
      )}
    </NodeViewWrapper>
  )
}

const EnhancedImage = ImageExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CustomImageNode)
  },
})

const MenuBar = ({
  editor,
  onOpenMathModal,
  onOpenImageModal,
  allowImages = true,
}: {
  editor: Editor | null
  onOpenMathModal: (initial: string, onSave: (latex: string) => void) => void
  onOpenImageModal?: (onSave: (url: string) => void) => void
  allowImages?: boolean
}) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-input bg-transparent p-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBold().run()
        }}
        data-state={editor.isActive("bold") ? "on" : "off"}
        className={editor.isActive("bold") ? "bg-muted" : ""}
      >
        <Bold className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleItalic().run()
        }}
        data-state={editor.isActive("italic") ? "on" : "off"}
        className={editor.isActive("italic") ? "bg-muted" : ""}
      >
        <Italic className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleUnderline().run()
        }}
        data-state={editor.isActive("underline") ? "on" : "off"}
        className={editor.isActive("underline") ? "bg-muted" : ""}
      >
        <UnderlineIcon className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleStrike().run()
        }}
        data-state={editor.isActive("strike") ? "on" : "off"}
        className={editor.isActive("strike") ? "bg-muted" : ""}
      >
        <Strikethrough className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleHighlight().run()
        }}
        data-state={editor.isActive("highlight") ? "on" : "off"}
        className={editor.isActive("highlight") ? "bg-muted" : ""}
      >
        <Highlighter className="size-4" />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleSuperscript().run()
        }}
        data-state={editor.isActive("superscript") ? "on" : "off"}
        className={editor.isActive("superscript") ? "bg-muted" : ""}
      >
        <SuperscriptIcon className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleSubscript().run()
        }}
        data-state={editor.isActive("subscript") ? "on" : "off"}
        className={editor.isActive("subscript") ? "bg-muted" : ""}
      >
        <SubscriptIcon className="size-4" />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleCode().run()
        }}
        data-state={editor.isActive("code") ? "on" : "off"}
        className={editor.isActive("code") ? "bg-muted" : ""}
      >
        <Code className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleCodeBlock().run()
        }}
        data-state={editor.isActive("codeBlock") ? "on" : "off"}
        className={editor.isActive("codeBlock") ? "bg-muted" : ""}
      >
        <CodeXml className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          onOpenMathModal("E = mc^2", (latex) => {
            editor.chain().focus().insertInlineMath({ latex }).run()
          })
        }}
        data-state={editor.isActive("inlineMath") ? "on" : "off"}
        className={editor.isActive("inlineMath") ? "bg-muted" : ""}
        title="Insert Math"
      >
        <Sigma className="size-4" />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-6" />
      
      {allowImages && (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.preventDefault()

              if (onOpenImageModal) {
                onOpenImageModal((url) => {
                  editor.chain().focus().setImage({ src: url }).run()
                })
              } else {
                const url = window.prompt("Enter Image URL:")
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run()
                }
              }
            }}
            title="Insert Image from URL"
          >
            <Link className="size-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
        </>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }}
        data-state={editor.isActive("heading", { level: 2 }) ? "on" : "off"}
        className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
      >
        <Heading2 className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBulletList().run()
        }}
        data-state={editor.isActive("bulletList") ? "on" : "off"}
        className={editor.isActive("bulletList") ? "bg-muted" : ""}
      >
        <List className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleOrderedList().run()
        }}
        data-state={editor.isActive("orderedList") ? "on" : "off"}
        className={editor.isActive("orderedList") ? "bg-muted" : ""}
      >
        <ListOrdered className="size-4" />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-6" />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().undo().run()
        }}
        disabled={!editor.can().undo()}
      >
        <Undo className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().redo().run()
        }}
        disabled={!editor.can().redo()}
      >
        <Redo className="size-4" />
      </Button>
    </div>
  )
}

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
  onPaste?: (e: ClipboardEvent) => void
  allowImages?: boolean
}

export function RichTextEditor({
  value,
  onChange,
  disabled,
  className,
  onPaste,
  allowImages = true,
}: RichTextEditorProps) {
  const editorRef = React.useRef<Editor | null>(null)

  const [isMathModalOpen, setIsMathModalOpen] = React.useState(false)
  const [mathInput, setMathInput] = React.useState("")
  const mathCallbackRef = React.useRef<((latex: string) => void) | null>(null)
  
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false)
  const [imageUrlInput, setImageUrlInput] = React.useState("")
  const imageCallbackRef = React.useRef<((url: string) => void) | null>(null)

  // Track text copied internally to prevent false penalty flags
  const lastCopiedTextRef = React.useRef<string>("")

  const openMathModal = React.useCallback(
    (initialLatex: string, onSave: (latex: string) => void) => {
      setMathInput(initialLatex)
      mathCallbackRef.current = onSave
      setIsMathModalOpen(true)
    },
    []
  )

  const openImageModal = React.useCallback(
    (onSave: (url: string) => void) => {
      setImageUrlInput("")
      imageCallbackRef.current = onSave
      setIsImageModalOpen(true)
    },
    []
  )

  const extensions = React.useMemo(
    () => [
      StarterKit,
      Highlight,
      Superscript,
      Subscript,
      EnhancedImage,
      // eslint-disable-next-line react-hooks/refs
      Mathematics.configure({
        inlineOptions: {
          onClick: (node: ProsemirrorNode, pos: number) => {
            const editor = editorRef.current
            if (!editor || !editor.isEditable) return
            openMathModal(node.attrs.latex, (katex) => {
              editor.chain().setNodeSelection(pos).updateInlineMath({ latex: katex }).focus().run()
            })
          },
        },
        blockOptions: {
          onClick: (node: ProsemirrorNode, pos: number) => {
            const editor = editorRef.current
            if (!editor || !editor.isEditable) return
            openMathModal(node.attrs.latex, (katex) => {
              editor.chain().setNodeSelection(pos).updateBlockMath({ latex: katex }).focus().run()
            })
          },
        },
        katexOptions: {
          throwOnError: false,
        },
      }),
    ],
    [openMathModal]
  )

  const editor = useEditor({
    extensions,
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      handlePaste: (_view, event) => {
        const pastedText = event.clipboardData?.getData("text/plain") || ""
        // Bypass anti-cheat if the text matches exactly what they just internally copied
        if (pastedText && pastedText.trim() !== "" && pastedText === lastCopiedTextRef.current) {
          return false 
        }
        if (onPaste) onPaste(event)
        return false // let tiptap continue
      },
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[150px] w-full rounded-md bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
  })

  // Keep the ref in sync
  React.useEffect(() => {
    editorRef.current = editor
  }, [editor])

  // Watch for external value changes
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div
      className={cn(
        "flex min-h-20 w-full flex-col overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
      onCopy={() => {
        const selection = window.getSelection()?.toString()
        if (selection) lastCopiedTextRef.current = selection
      }}
      onCut={() => {
        const selection = window.getSelection()?.toString()
        if (selection) lastCopiedTextRef.current = selection
      }}
    >
      <MenuBar editor={editor} onOpenMathModal={openMathModal} onOpenImageModal={openImageModal} allowImages={allowImages} />
      <EditorContent editor={editor} className="flex-1 cursor-text" />

      <Dialog open={isMathModalOpen} onOpenChange={setIsMathModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Math Formula</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={mathInput}
              onChange={(e) => setMathInput(e.target.value)}
              placeholder="e.g. E = mc^2"
              onPaste={(e) => {
                const pastedText = e.clipboardData?.getData("text/plain") || ""
                if (pastedText && pastedText.trim() !== "" && pastedText === lastCopiedTextRef.current) {
                  return // bypass
                }
                if (onPaste) {
                  onPaste(e.nativeEvent)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (mathInput.trim() !== "") {
                    mathCallbackRef.current?.(mathInput)
                    setIsMathModalOpen(false)
                  }
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMathModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (mathInput.trim() !== "") {
                  mathCallbackRef.current?.(mathInput)
                  setIsMathModalOpen(false)
                }
              }}
            >
              Save Formula
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Image URL</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/image.png"
              onPaste={(e) => {
                const pastedText = e.clipboardData?.getData("text/plain") || ""
                if (pastedText && pastedText.trim() !== "" && pastedText === lastCopiedTextRef.current) {
                  return // bypass
                }
                if (onPaste) {
                  onPaste(e.nativeEvent)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (imageUrlInput.trim() !== "") {
                    imageCallbackRef.current?.(imageUrlInput)
                    setIsImageModalOpen(false)
                  }
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (imageUrlInput.trim() !== "") {
                  imageCallbackRef.current?.(imageUrlInput)
                  setIsImageModalOpen(false)
                }
              }}
            >
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function RichTextViewer({ content, className }: { content: string; className?: string }) {
  const extensionsWithoutRefs = React.useMemo(
    () => [
      StarterKit,
      Highlight,
      Superscript,
      Subscript,
      EnhancedImage,
      Mathematics.configure({
        katexOptions: { throwOnError: false },
      }),
    ],
    []
  )

  const editor = useEditor({
    extensions: extensionsWithoutRefs,
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn("prose prose-sm dark:prose-invert max-w-none focus:outline-none", className),
      },
    },
  })

  // Watch for external value changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return <EditorContent editor={editor} />
}
