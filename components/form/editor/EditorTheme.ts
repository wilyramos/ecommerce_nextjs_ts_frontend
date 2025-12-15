//File: frontend/components/form/editor/EditorTheme.ts

const EditorTheme = {
    ltr: "text-left",
    rtl: "text-right",
    paragraph: "mb-2",
    quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4",
    heading: {
        h1: "text-3xl font-bold mb-4 mt-6",
        h2: "text-2xl font-semibold mb-3 mt-5",
        h3: "text-xl font-medium mb-2 mt-4",
    },
    list: {
        nested: {
            listitem: "pl-4", // Indentación para listas anidadas
        },
        ol: "list-decimal pl-5 mb-4",
        ul: "list-disc pl-5 mb-4",
        listitem: "mb-1",
    },
    image: "editor-image",
    link: "text-blue-500 hover:underline cursor-pointer",
    text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "line-through",
        underlineStrikethrough: "underline line-through",
        code: "bg-gray-100 rounded px-1 font-mono text-sm text-red-500",
    },
    // Estilos para Tablas
    table: "border-collapse border border-gray-300 w-full my-4 text-sm",
    tableCell: "border border-gray-300 p-2 align-top",
    tableCellHeader: "bg-gray-100 font-semibold",
    tableRow: "hover:bg-gray-50",
};

export default EditorTheme;