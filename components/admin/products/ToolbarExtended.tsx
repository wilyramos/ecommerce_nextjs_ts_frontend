"use client";

import { useState, useEffect, useCallback, ReactNode, ChangeEvent } from "react";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  UNDO_COMMAND,
  REDO_COMMAND,
  LexicalEditor,
  RangeSelection
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createLinkNode } from "@lexical/link";

// Iconos
import {
  Bold, Italic, Underline, Undo2, Redo2, Code, Table as TableIcon,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Palette, Highlighter, Link as LinkIcon, Type, Download
} from "lucide-react";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FormMediaField } from "@/components/form/FormMediaField";

interface ColorPickerProps {
  icon: ReactNode;
  color: string;
  onChange: (color: string) => void;
  title: string;
}

const ColorPicker = ({ icon, color, onChange, title }: ColorPickerProps) => {
  const [localColor, setLocalColor] = useState<string>(color);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalColor(val);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
      onChange(val);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="p-1.5 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 relative cursor-pointer outline-none transition-colors"
          title={title}
        >
          {icon}
          <span
            className="absolute bottom-1 left-1 right-1 h-0.5 rounded-full"
            style={{ backgroundColor: color !== "transparent" ? color : "#000" }}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="w-80">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-12 h-12 rounded border border-gray-300 shadow-sm overflow-hidden">
              <input
                type="color"
                value={localColor.length === 7 ? localColor : "#000000"}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setLocalColor(e.target.value);
                  onChange(e.target.value);
                }}
                className="w-full h-full p-0 border-0 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <Input
                value={localColor}
                onChange={handleHexChange}
                className="font-mono uppercase text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface LinkDialogProps {
  editor: LexicalEditor;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const LinkDialog = ({ editor, isOpen, onOpenChange }: LinkDialogProps) => {
  const [url, setUrl] = useState<string>("");

  const handleAddLink = () => {
    if (!url) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const linkNode = $createLinkNode(url);
        (selection as RangeSelection).insertNodes([linkNode]);
      }
    });
    setUrl("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insertar Enlace</DialogTitle>
          <DialogDescription>Agrega un enlace al contenido seleccionado</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="link-url">URL del Enlace</Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              className="mt-1"
            />
          </div>
          <button
            onClick={handleAddLink}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors self-end text-sm font-medium"
          >
            Insertar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ToolbarExtendedProps {
  onToggleHTML: () => void;
  isHTMLMode: boolean;
  mediaResetKey: number;
  onMediaChange: (urls: string[]) => void;
  onExport?: (html: string) => void;
  showStats?: boolean;
}

export default function ToolbarExtended({
  onToggleHTML,
  isHTMLMode,
  mediaResetKey,
  onMediaChange,
  onExport,
}: ToolbarExtendedProps) {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [fontColor, setFontColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [linkDialogOpen, setLinkDialogOpen] = useState<boolean>(false);

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const rangeSelection = selection as RangeSelection;
        setIsBold(rangeSelection.hasFormat("bold"));
        setIsItalic(rangeSelection.hasFormat("italic"));
        setIsUnderline(rangeSelection.hasFormat("underline"));

        const currentFontColor = $getSelectionStyleValueForProperty(rangeSelection, "color", "#000000");
        const currentBgColor = $getSelectionStyleValueForProperty(rangeSelection, "background-color", "#ffffff");

        setFontColor(currentFontColor);
        setBgColor(currentBgColor);
      }
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const btnClass = (active: boolean) =>
    `p-1.5 w-8 h-8 flex items-center justify-center rounded transition-all cursor-pointer outline-none ${
      active
        ? "bg-black text-white shadow-sm dark:bg-white dark:text-black"
        : "hover:bg-muted text-foreground active:bg-muted/80"
    } disabled:opacity-50 disabled:cursor-not-allowed`;

  const insertTable = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: "3", rows: "3" });
  };

  const applyColor = (color: string, type: "color" | "background-color") => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const rangeSelection = selection as RangeSelection;
      const nodes = rangeSelection.getNodes();
      nodes.forEach((node) => {
        const parent = node.getParent();
        if (parent && $isHeadingNode(parent)) {
          parent.setStyle(`${type}: ${color}`);
        }
      });

      $patchStyleText(rangeSelection, { [type]: color });
    });
  };

  const formatHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection as RangeSelection, () => $createHeadingNode(tag));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection as RangeSelection, () => $createQuoteNode());
      }
    });
  };

  const handleExport = () => {
    editor.update(() => {
      const html = editor.getRootElement()?.innerHTML || "";
      if (onExport) {
        onExport(html);
      }
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-1 bg-background p-2 items-center select-none w-full border-b border-border/40">
        {/* Vista / Modo */}
        <button
          type="button"
          className={btnClass(isHTMLMode)}
          onClick={onToggleHTML}
          title="Cambiar a modo HTML"
        >
          <Code size={16} />
        </button>

        <div className="w-[1px] h-6 bg-border mx-1" />

        {/* Historial (Undo/Redo) */}
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(false)}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          title="Deshacer (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(false)}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          title="Rehacer (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </button>

        <div className="w-[1px] h-6 bg-border mx-1" />

        {/* Bloques y Encabezados */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              disabled={isHTMLMode}
              className={btnClass(false)}
              title="Estilos de párrafo"
            >
              <Type size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border border-border shadow-md">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Títulos</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => formatHeading("h1")} className="text-3xl font-bold cursor-pointer">
              Título 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading("h2")} className="text-2xl font-bold cursor-pointer">
              Título 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading("h3")} className="text-xl font-bold cursor-pointer">
              Título 3
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Otros</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => formatQuote()} className="italic border-l-2 pl-2 cursor-pointer">
              Cita
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}
              className="cursor-pointer"
            >
              Párrafo Normal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Formato de Texto Inline */}
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(isBold)}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          title="Negrita (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(isItalic)}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
          title="Cursiva (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(isUnderline)}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
          title="Subrayado (Ctrl+U)"
        >
          <Underline size={16} />
        </button>

        <div className="w-[1px] h-6 bg-border mx-1" />

        {/* Estilos de Color (Ocultos en modo HTML) */}
        {!isHTMLMode && (
          <>
            <ColorPicker
              title="Color de Texto"
              icon={<Palette size={16} />}
              color={fontColor}
              onChange={(c: string) => applyColor(c, "color")}
            />
            <ColorPicker
              title="Color de Fondo"
              icon={<Highlighter size={16} />}
              color={bgColor}
              onChange={(c: string) => applyColor(c, "background-color")}
            />
            <div className="w-[1px] h-6 bg-border mx-1" />
          </>
        )}

        {/* Alineación de Elementos */}
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(false)}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
          title="Alinear a la izquierda"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(false)}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
          title="Centrar"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(false)}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
          title="Alinear a la derecha"
        >
          <AlignRight size={16} />
        </button>

        <div className="w-[1px] h-6 bg-border mx-1" />

        {/* Estructuras (Listas y Tablas) */}
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(false)}
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
          title="Lista con viñetas"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(false)}
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          disabled={isHTMLMode}
          className={btnClass(false)}
          onClick={insertTable}
          title="Insertar tabla"
        >
          <TableIcon size={16} />
        </button>

        <div className="w-[1px] h-6 bg-border mx-1" />

        {/* Inserciones (Enlaces) */}
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              disabled={isHTMLMode}
              className={btnClass(false)}
              title="Insertar enlace"
            >
              <LinkIcon size={16} />
            </button>
          </DialogTrigger>
          <LinkDialog editor={editor} isOpen={linkDialogOpen} onOpenChange={setLinkDialogOpen} />
        </Dialog>

        {/* Gestor de Medios Multimedia (Oculto en modo HTML) */}
        {!isHTMLMode && (
          <div className="inline-block relative shrink-0 [&_label]:hidden [&_.grid_div]:hidden [&_.grid_button_span]:hidden [&_.grid_button]:w-8 [&_.grid_button]:h-8 [&_.grid_button]:border-0 [&_.grid_button]:rounded [&_.grid_button]:bg-transparent [&_.grid_button]:hover:bg-muted [&_.grid_button]:text-foreground [&_.grid_button_svg]:m-0 [&_.grid_button_svg]:text-base">
            <FormMediaField
              key={mediaResetKey}
              name="editor_toolbar_media"
              folder="products"
              defaultValue={[]}
              multiple={true}
              maxFiles={10}
              accept="image"
              onChange={onMediaChange}
            />
          </div>
        )}

        {/* Acción de Exportación Directa (Si está presente) */}
        {onExport && (
          <>
            <div className="w-[1px] h-6 bg-border mx-1" />
            <button
              type="button"
              className={btnClass(false)}
              onClick={handleExport}
              title="Exportar documento HTML"
            >
              <Download size={16} />
            </button>
          </>
        )}
      </div>
    </>
  );
}