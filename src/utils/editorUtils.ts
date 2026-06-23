/**
 * Utilidades para el Editor de Texto Rico Extendido
 */

export interface EditorConfig {
  enableImages?: boolean;
  enableVideos?: boolean;
  enableCodeBlocks?: boolean;
  enableTables?: boolean;
  enableLinks?: boolean;
  maxContentLength?: number;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export interface EditorStats {
  words: number;
  characters: number;
  length: number;
}

export interface EditorExportPayload {
  content: string;
  text: string;
  stats: EditorStats;
  metadata: Record<string, string | number | boolean | null | undefined>;
  exportedAt: string;
}

export interface AutoSavePayload {
  content: string;
  timestamp: number;
}

const DEFAULT_CONFIG: EditorConfig = {
  enableImages: true,
  enableVideos: true,
  enableCodeBlocks: true,
  enableTables: true,
  enableLinks: true,
  maxContentLength: 50000,
  autoSave: false,
  autoSaveInterval: 10000,
};

/**
 * Valida el contenido HTML del editor
 */
export function validateEditorContent(html: string, config: EditorConfig = DEFAULT_CONFIG): boolean {
  if (!html || html.trim().length === 0) {
    return false;
  }

  if (config.maxContentLength && html.length > config.maxContentLength) {
    console.warn(`Content exceeds maximum length of ${config.maxContentLength} characters`);
    return false;
  }

  return true;
}

/**
 * Limpia el HTML generado por el editor
 */
export function cleanEditorHTML(html: string): string {
  let cleaned = html.replace(/data-[a-z-]+="[^"]*"/gi, "");
  cleaned = cleaned.replace(/<[^>]*>/g, "");
  cleaned = cleaned.replace(/\n\s*\n/g, "\n");
  return cleaned.trim();
}

/**
 * Extrae texto plano del HTML de manera segura para SSR
 */
export function extractPlainText(html: string): string {
  if (typeof window === "undefined") return "";
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  } catch (error) {
    console.error("Error parsing HTML to text:", error);
    return "";
  }
}

/**
 * Cuenta palabras en HTML
 */
export function countWords(html: string): number {
  const text = extractPlainText(html);
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Cuenta caracteres en HTML
 */
export function countCharacters(html: string): number {
  return extractPlainText(html).length;
}

/**
 * Obtiene un resumen del contenido HTML
 */
export function getSummary(html: string, maxLength: number = 160): string {
  const text = extractPlainText(html);
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Convierte HTML a Markdown (básico)
 */
export function htmlToMarkdown(html: string): string {
  let markdown = html;

  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n");
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n");
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n");
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n");

  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, "\n$1\n");

  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");

  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");

  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, listContent: string) => {
    return "\n" + listContent.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n").trim() + "\n";
  });

  markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, listContent: string) => {
    let index = 1;
    return "\n" + listContent.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${index++}. $1\n`).trim() + "\n";
  });

  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, "![$2]($1)");
  markdown = markdown.replace(/<br\s*\/?>/gi, "\n");
  markdown = markdown.replace(/<[^>]*>/g, "");

  return markdown.trim();
}

/**
 * Valida URLs
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtiene tipo de contenido de una URL
 */
export function getContentTypeFromURL(url: string): "image" | "video" | "unknown" {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];

  const lowerUrl = url.toLowerCase();

  if (imageExtensions.some((ext) => lowerUrl.includes(ext))) return "image";
  if (videoExtensions.some((ext) => lowerUrl.includes(ext))) return "video";

  return "unknown";
}

/**
 * Genera un ID único para elementos del editor
 */
export function generateEditorNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Valida configuración del editor
 */
export function validateEditorConfig(config: EditorConfig): boolean {
  if (config.autoSaveInterval && config.autoSaveInterval < 1000) {
    console.warn("autoSaveInterval debe ser mayor a 1000ms");
    return false;
  }

  if (config.maxContentLength && config.maxContentLength < 100) {
    console.warn("maxContentLength debe ser mayor a 100 caracteres");
    return false;
  }

  return true;
}

/**
 * Exporta contenido del editor en diferentes formatos protegidos para ambientes SSR
 */
export class EditorExporter {
  static toHTML(html: string): string {
    return cleanEditorHTML(html);
  }

  static toMarkdown(html: string): string {
    return htmlToMarkdown(html);
  }

  static toPlainText(html: string): string {
    return extractPlainText(html);
  }

  static toJSON(html: string, metadata: Record<string, string | number | boolean | null | undefined> = {}): EditorExportPayload {
    return {
      content: cleanEditorHTML(html),
      text: extractPlainText(html),
      stats: {
        words: countWords(html),
        characters: countCharacters(html),
        length: html.length,
      },
      metadata,
      exportedAt: new Date().toISOString(),
    };
  }

  private static triggerDownload(content: string, filename: string, contentType: string): void {
    if (typeof window === "undefined") return;
    const element = document.createElement("a");
    element.setAttribute("href", `data:${contentType};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  static downloadAsHTML(html: string, filename: string = "document.html"): void {
    this.triggerDownload(this.toHTML(html), filename, "text/html");
  }

  static downloadAsMarkdown(html: string, filename: string = "document.md"): void {
    this.triggerDownload(this.toMarkdown(html), filename, "text/plain");
  }

  static downloadAsJSON(html: string, filename: string = "document.json", metadata: Record<string, string | number | boolean | null | undefined> = {}): void {
    const jsonString = JSON.stringify(this.toJSON(html, metadata), null, 2);
    this.triggerDownload(jsonString, filename, "application/json");
  }
}

/**
 * Almacenamiento automático en localStorage protegido para SSR
 */
export class AutoSaveManager {
  private storageKey: string;
  private interval: ReturnType<typeof setInterval> | null = null;

  constructor(storageKey: string = "editor_autosave") {
    this.storageKey = storageKey;
  }

  start(getContent: () => string, interval: number = 10000): void {
    if (typeof window === "undefined") return;
    this.stop();
    this.interval = setInterval(() => {
      const content = getContent();
      try {
        const payload: AutoSavePayload = { content, timestamp: Date.now() };
        localStorage.setItem(this.storageKey, JSON.stringify(payload));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }, interval);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getSavedContent(): string | null {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as AutoSavePayload;
        return parsed.content;
      }
    } catch (error) {
      console.error("Error retrieving from localStorage:", error);
    }
    return null;
  }

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }

  destroy(): void {
    this.stop();
    this.clear();
  }
}