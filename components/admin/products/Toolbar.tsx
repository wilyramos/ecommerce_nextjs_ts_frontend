//File: frontend/components/admin/products/Toolbar.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import {
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
    UNDO_COMMAND,
    REDO_COMMAND
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
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";

// Iconos
import {
    Bold, Italic, Underline, Undo2, Redo2, Image as ImageIcon,
    Code, Table as TableIcon, AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, Heading1, Palette, Highlighter
} from "lucide-react";

import { $createImageNode } from "@/components/editor/nodes/ImageNode";

// Componentes UI
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader,
    DialogTitle, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { $isHeadingNode } from "@lexical/rich-text";


// --- SUBCOMPONENTE: Selector de Color Avanzado ---
interface ColorPickerProps {
    icon: React.ReactNode;
    color: string;
    onChange: (color: string) => void;
    title: string;
}

const ColorPicker = ({ icon, color, onChange, title }: ColorPickerProps) => {
    // Estado local para input manual
    const [localColor, setLocalColor] = useState(color);

    useEffect(() => {
        setLocalColor(color);
    }, [color]);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalColor(val);
        // Validar Hex básico (3 o 6 dígitos)
        if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
            onChange(val);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="p-1.5 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 relative"
                    title={title}
                >
                    {icon}
                    {/* Línea de color debajo del icono */}
                    <span
                        className="absolute bottom-1 left-1 right-1 h-0.5 rounded-full"
                        style={{ backgroundColor: color !== "transparent" ? color : "#000" }}
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-3 w-56 bg-white" align="start">
                <div className="flex flex-col gap-3">
                    <Label className="text-xs font-semibold text-muted-foreground">{title}</Label>

                    <div className="flex items-center gap-2">
                        {/* Input Nativo (Visual) */}
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
                            <input
                                type="color"
                                value={localColor.length === 7 ? localColor : "#000000"} // fallback para hex inválidos
                                onChange={(e) => {
                                    setLocalColor(e.target.value);
                                    onChange(e.target.value);
                                }}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                            />
                        </div>

                        {/* Input Hexadecimal (Texto) */}
                        <div className="flex-1 relative">
                            <Input
                                value={localColor}
                                onChange={handleHexChange}
                                className="h-8 text-xs font-mono uppercase"
                                placeholder="#000000"
                            />
                        </div>
                    </div>

                    {/* Botón para resetear (opcional) */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs w-full"
                        onClick={() => {
                            setLocalColor("#000000");
                            onChange("#000000");
                        }}
                    >
                        Resetear a Negro
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


export default function Toolbar({ onToggleHTML, isHTMLMode }: {
    onToggleHTML: () => void;
    isHTMLMode: boolean;
}) {
    const [editor] = useLexicalComposerContext();

    // Estados de formato
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    // Estados de color
    const [fontColor, setFontColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");

    // Estados para diálogos
    const [openImg, setOpenImg] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    // Función que lee el estado del editor y actualiza la UI
    const updateToolbar = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                setIsBold(selection.hasFormat("bold"));
                setIsItalic(selection.hasFormat("italic"));
                setIsUnderline(selection.hasFormat("underline"));

                // Leer colores actuales de la selección
                const currentFontColor = $getSelectionStyleValueForProperty(selection, "color", "#000000");
                const currentBgColor = $getSelectionStyleValueForProperty(selection, "background-color", "#ffffff");

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

    // Helpers
    const btnClass = (active: boolean) =>
        `p-1.5 w-8 h-8 flex items-center justify-center rounded transition-colors ${active ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"
        }`;

    const insertImage = () => {
        if (!imageUrl.trim()) return;
        editor.update(() => {
            const node = $createImageNode(imageUrl, "image");
            const selection = $getSelection();
            if ($isRangeSelection(selection)) selection.insertNodes([node]);
        });
        setImageUrl("");
        setOpenImg(false);
    };

    const insertTable = () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: "3", rows: "3" });
    };

    const applyColor = (color: string, type: "color" | "background-color") => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const nodes = selection.getNodes();

            nodes.forEach(node => {
                const parent = node.getParent();

                if (parent && $isHeadingNode(parent)) {
                    parent.setStyle(`${type}: ${color}`);
                }
            });

            $patchStyleText(selection, { [type]: color });
        });
    };

    const formatHeading = (tag: HeadingTagType) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(tag));
            }
        });
    };

    const formatQuote = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
            }
        });
    };

    return (
        <div className="flex flex-wrap gap-1 border-b bg-white p-2 sticky top-0 z-10 items-center select-none">

            {/* HTML Switch */}
            <button
                type="button"
                className={btnClass(isHTMLMode)}
                onClick={onToggleHTML}
                title="Ver HTML"
            >
                <Code size={16} />
            </button>

            <div className="w-[1px] h-6 bg-gray-200 mx-1" />

            {/* History */}
            <button type="button" className={btnClass(false)} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
                <Undo2 size={16} />
            </button>
            <button type="button" className={btnClass(false)} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
                <Redo2 size={16} />
            </button>

            <div className="w-[1px] h-6 bg-gray-200 mx-1" />

            {/* Headings */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className={btnClass(false)} title="Estilos de texto">
                        <Heading1 size={16} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => formatHeading("h1")} className="text-3xl font-bold">Título 1</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => formatHeading("h2")} className="text-2xl font-bold">Título 2</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => formatHeading("h3")} className="text-xl font-bold">Título 3</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => formatQuote()} className="italic border-l-2 pl-2">Cita</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}>Párrafo Normal</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Formato Básico */}
            <button type="button" className={btnClass(isBold)} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
                <Bold size={16} />
            </button>
            <button type="button" className={btnClass(isItalic)} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
                <Italic size={16} />
            </button>
            <button type="button" className={btnClass(isUnderline)} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
                <Underline size={16} />
            </button>

            <div className="w-[1px] h-6 bg-gray-200 mx-1" />

            {/* --- SELECCIÓN DE COLORES --- */}

            {/* Color de Texto */}
            <ColorPicker
                title="Color de Texto"
                icon={<Palette size={16} />}
                color={fontColor}
                onChange={(c) => applyColor(c, "color")}
            />

            {/* Color de Fondo (Resaltado) */}
            <ColorPicker
                title="Color de Fondo"
                icon={<Highlighter size={16} />}
                color={bgColor}
                onChange={(c) => applyColor(c, "background-color")}
            />

            <div className="w-[1px] h-6 bg-gray-200 mx-1" />

            {/* Alineación */}
            <button type="button" className={btnClass(false)} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}>
                <AlignLeft size={16} />
            </button>
            <button type="button" className={btnClass(false)} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}>
                <AlignCenter size={16} />
            </button>
            <button type="button" className={btnClass(false)} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}>
                <AlignRight size={16} />
            </button>

            <div className="w-[1px] h-6 bg-gray-200 mx-1" />

            {/* Listas */}
            <button type="button" className={btnClass(false)} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
                <List size={16} />
            </button>
            <button type="button" className={btnClass(false)} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
                <ListOrdered size={16} />
            </button>

            {/* Tabla */}
            <button type="button" className={btnClass(false)} onClick={insertTable} title="Insertar Tabla">
                <TableIcon size={16} />
            </button>

            {/* Imagen */}
            <Dialog open={openImg} onOpenChange={setOpenImg}>
                <DialogTrigger asChild>
                    <button type="button" className={btnClass(false)}>
                        <ImageIcon size={16} />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Añadir imagen</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>URL de la imagen</Label>
                        <Input
                            className="mt-2"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={insertImage}>Insertar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}