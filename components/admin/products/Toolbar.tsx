// File: frontend/components/admin/products/Toolbar.tsx
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
    Bold, Italic, Underline, Undo2, Redo2,
    Code, Table as TableIcon, AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, Heading1, Palette, Highlighter
} from "lucide-react";

// Componentes UI
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

import { FormMediaField } from "@/components/form/FormMediaField";

interface ColorPickerProps {
    icon: React.ReactNode;
    color: string;
    onChange: (color: string) => void;
    title: string;
}

const ColorPicker = ({ icon, color, onChange, title }: ColorPickerProps) => {
    const [localColor, setLocalColor] = useState(color);

    useEffect(() => {
        setLocalColor(color);
    }, [color]);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalColor(val);
        if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
            onChange(val);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="p-1.5 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 relative cursor-pointer outline-none"
                    title={title}
                >
                    {icon}
                    <span
                        className="absolute bottom-1 left-1 right-1 h-0.5 rounded-full"
                        style={{ backgroundColor: color !== "transparent" ? color : "#000" }}
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-3 w-56 bg-white shadow-md border border-border" align="start">
                <div className="flex flex-col gap-3">
                    <Label className="text-xs font-semibold text-muted-foreground">{title}</Label>
                    <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
                            <input
                                type="color"
                                value={localColor.length === 7 ? localColor : "#000000"}
                                onChange={(e) => {
                                    setLocalColor(e.target.value);
                                    onChange(e.target.value);
                                }}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <Input
                                value={localColor}
                                onChange={handleHexChange}
                                className="h-8 text-xs font-mono uppercase"
                                placeholder="#000000"
                            />
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

interface ToolbarProps {
    onToggleHTML: () => void;
    isHTMLMode: boolean;
    mediaResetKey: number;
    onMediaChange: (urls: string[]) => void;
}

export default function Toolbar({ onToggleHTML, isHTMLMode, mediaResetKey, onMediaChange }: ToolbarProps) {
    const [editor] = useLexicalComposerContext();

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const [fontColor, setFontColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");

    const updateToolbar = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                setIsBold(selection.hasFormat("bold"));
                setIsItalic(selection.hasFormat("italic"));
                setIsUnderline(selection.hasFormat("underline"));

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

    const btnClass = (active: boolean) =>
        `p-1.5 w-8 h-8 flex items-center justify-center rounded transition-colors cursor-pointer outline-none ${
            active ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"
        }`;

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
        <div className="flex flex-wrap gap-1 bg-white p-2 items-center select-none w-full">
            <button
                type="button"
                className={btnClass(isHTMLMode)}
                onClick={onToggleHTML}
                title="Ver HTML"
            >
                <Code size={16} />
            </button>

            <div className="w-[1px] h-6 bg-gray-200 mx-1" />

            <button 
                type="button" 
                disabled={isHTMLMode}
                className={btnClass(false)} 
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                title="Deshacer"
            >
                <Undo2 size={16} />
            </button>
            <button 
                type="button" 
                disabled={isHTMLMode}
                className={btnClass(false)} 
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                title="Rehacer"
            >
                <Redo2 size={16} />
            </button>

            <div className="w-[1px] h-6 bg-gray-200 mx-1" />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button type="button" disabled={isHTMLMode} className={btnClass(false)} title="Estilos de texto">
                        <Heading1 size={16} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-border shadow-md">
                    <DropdownMenuItem onClick={() => formatHeading("h1")} className="text-3xl font-bold cursor-pointer">Título 1</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => formatHeading("h2")} className="text-2xl font-bold cursor-pointer">Título 2</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => formatHeading("h3")} className="text-xl font-bold cursor-pointer">Título 3</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => formatQuote()} className="italic border-l-2 pl-2 cursor-pointer">Cita</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)} className="cursor-pointer">Párrafo Normal</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <button type="button" disabled={isHTMLMode} className={btnClass(isBold)} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} title="Negrita">
                <Bold size={16} />
            </button>
            <button type="button" disabled={isHTMLMode} className={btnClass(isItalic)} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} title="Cursiva">
                <Italic size={16} />
            </button>
            <button type="button" disabled={isHTMLMode} className={btnClass(isUnderline)} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} title="Subrayado">
                <Underline size={16} />
            </button>

            <div className="w-[1px] h-6 bg-gray-200 mx-1" />

            {!isHTMLMode && (
                <>
                    <ColorPicker
                        title="Color de Texto"
                        icon={<Palette size={16} />}
                        color={fontColor}
                        onChange={(c) => applyColor(c, "color")}
                    />
                    <ColorPicker
                        title="Color de Fondo"
                        icon={<Highlighter size={16} />}
                        color={bgColor}
                        onChange={(c) => applyColor(c, "background-color")}
                    />
                    <div className="w-[1px] h-6 bg-gray-200 mx-1" />
                </>
            )}

            <button type="button" disabled={isHTMLMode} className={btnClass(false)} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")} title="Alinear a la izquierda">
                <AlignLeft size={16} />
            </button>
            <button type="button" disabled={isHTMLMode} className={btnClass(false)} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")} title="Centrar">
                <AlignCenter size={16} />
            </button>
            <button type="button" disabled={isHTMLMode} className={btnClass(false)} onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")} title="Alinear a la derecha">
                <AlignRight size={16} />
            </button>

            <div className="w-[1px] h-6 bg-gray-200 mx-1" />

            <button type="button" disabled={isHTMLMode} className={btnClass(false)} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} title="Lista con viñetas">
                <List size={16} />
            </button>
            <button type="button" disabled={isHTMLMode} className={btnClass(false)} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} title="Lista numerada">
                <ListOrdered size={16} />
            </button>
            <button type="button" disabled={isHTMLMode} className={btnClass(false)} onClick={insertTable} title="Insertar Tabla">
                <TableIcon size={16} />
            </button>

            {!isHTMLMode && (
                <div className="inline-block relative shrink-0 [&_label]:hidden [&_.grid_div]:hidden [&_.grid_button_span]:hidden [&_.grid_button]:w-8 [&_.grid_button]:h-8 [&_.grid_button]:border-0 [&_.grid_button]:rounded [&_.grid_button]:bg-transparent [&_.grid_button]:hover:bg-gray-100 [&_.grid_button]:text-gray-700 [&_.grid_button_svg]:m-0 [&_.grid_button_svg]:text-base">
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
        </div>
    );
}