// File: frontend/components/ui/RichTextEditorExtended.tsx

const EditorThemeExtended = {
  ltr: "text-left",
  rtl: "text-right",
  
  // Párrafos
  paragraph: "mb-3 leading-relaxed",
  
  // Citas
  quote: "border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50/50 py-2 rounded-r",
  
  // Encabezados
  heading: {
    h1: "text-4xl font-bold mb-4 mt-8 leading-tight text-gray-900",
    h2: "text-3xl font-semibold mb-3 mt-6 leading-tight text-gray-800",
    h3: "text-2xl font-semibold mb-2 mt-5 text-gray-800",
    h4: "text-xl font-medium mb-2 mt-4 text-gray-700",
    h5: "text-lg font-medium mb-2 mt-3 text-gray-700",
    h6: "text-base font-medium mb-2 mt-3 text-gray-700",
  },
  
  // Listas
  list: {
    nested: {
      listitem: "pl-6",
    },
    ol: "list-decimal pl-8 mb-4 space-y-1",
    ul: "list-disc pl-8 mb-4 space-y-1",
    listitem: "mb-1",
  },
  
  // Imágenes
  image: "editor-image max-w-full h-auto rounded",
  
  // Enlaces
  link: "text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-medium",
  
  // Textos con estilos
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "bg-gray-100 border border-gray-300 rounded px-2 py-0.5 font-mono text-sm text-orange-600",
    subscript: "subscript",
    superscript: "superscript",
  },
  
  // Tablas
  table: "border-collapse border border-gray-300 w-full my-4 text-sm rounded overflow-hidden",
  tableCell: "border border-gray-300 p-3 align-top",
  tableCellHeader: "bg-gray-100 font-semibold text-gray-700",
  tableRow: "hover:bg-gray-50 transition-colors",
  
  // Bloques de código
  codeblock: "bg-gray-900 text-gray-100 rounded my-4 p-4 overflow-x-auto font-mono text-sm",
  
  // Divisores
  hr: "my-6 border-t-2 border-gray-300",
  
  // Contenedor del editor
  root: "prose prose-sm dark:prose-invert max-w-none",
  
  // Placeholder
  placeholder: "text-gray-400/60 text-sm",
};

export default EditorThemeExtended;