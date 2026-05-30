// File: frontend/services/MediaService.ts

import {
  UploadMediaParamsSchema,
  UploadResponseSchema,
  MediaListResponseSchema,
  DeleteMediaResponseSchema,
  MediaSchema,
} from '../types/media.schemas';
import type {
  UploadMediaParams,
  UploadResponse,
  MediaListParams,
  MediaListResponse,
  DeleteMediaResponse,
  Media,
} from '../types/media.types';

const IS_SERVER = typeof window === 'undefined';

const getRequestUrl = (path: string): string => {
  if (IS_SERVER) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_API_URL no está definida en las variables de entorno');
    }
    return `${backendUrl}${path}`;
  }
  return `/api${path}`;
};

// ─── Helper de Procesamiento de Respuestas HTTP ───────────────────────────────

async function handleResponse<T>(
  res: globalThis.Response,
  schema: { parse: (data: unknown) => T },
  contextName: string
): Promise<T> {
  const json = (await res.json().catch(() => null)) as Record<string, unknown> | null;

  console.log(`[MediaService:${contextName}] HTTP Status:`, res.status);
  console.log(`[MediaService:${contextName}] JSON recibido:`, json);

  if (!res.ok) {
    const message = typeof json?.message === 'string' ? json.message : `Error ${res.status}: ${res.statusText}`;
    throw new Error(message);
  }

  try {
    return schema.parse(json);
  } catch (zodError) {
    console.error(`[MediaService:${contextName}] Error crítico de Zod al parsear la respuesta:`, zodError);
    throw zodError;
  }
}

// ─── Media Service Engine ─────────────────────────────────────────────────────

export const MediaService = {
  /**
   * Sube uno o múltiples archivos (imágenes o videos) manteniendo el progreso.
   */
  async upload(
    params: UploadMediaParams,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    if (IS_SERVER) {
      throw new Error('El método "upload" con barra de progreso requiere el entorno del navegador.');
    }

    console.log('[MediaService:upload] Parámetros recibidos para validación previa:', params);
    const validated = UploadMediaParamsSchema.parse(params);

    const formData = new FormData();
    formData.append('folder', validated.folder);
    validated.files.forEach((file) => formData.append('files', file));

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            // Se calcula sobre el 95% del total para reservar el 5% restante al tiempo de procesamiento del backend
            const percent = Math.round((event.loaded / event.total) * 95);
            onProgress(percent);
          }
        });
      }

      xhr.addEventListener('load', () => {
        try {
          const json = JSON.parse(xhr.responseText) as Record<string, unknown> | null;
          console.log('[MediaService:upload] XHR Status:', xhr.status);
          console.log('[MediaService:upload] XHR Response JSON original:', json);

          if (xhr.status >= 400) {
            const message = typeof json?.message === 'string' ? json.message : `Error ${xhr.status}`;
            reject(new Error(message));
            return;
          }

          // Completar la barra al 100% una vez que el servidor responde con éxito
          if (onProgress) {
            onProgress(100);
          }

          let finalPayload: unknown = json;

          try {
            finalPayload = UploadResponseSchema.parse(json);
          } catch (firstZodError) {
            console.warn('[MediaService:upload] El JSON completo no coincide con UploadResponseSchema. Intentando estrategias de contingencia...', firstZodError);

            const extractedData = json && typeof json === 'object' && 'data' in json ? json.data : json;

            try {
              finalPayload = UploadResponseSchema.parse(extractedData);
            } catch (secondZodError) {
              console.error('[MediaService:upload] Error definitivo de validación de Zod en subida:', secondZodError);
              reject(secondZodError);
              return;
            }
          }

          resolve(finalPayload as UploadResponse);
        } catch (err) {
          console.error('[MediaService:upload] Excepción en subida:', err);
          reject(err);
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Error de red al subir los archivos')));
      xhr.addEventListener('abort', () => reject(new Error('Subida cancelada por el usuario')));

      xhr.open('POST', getRequestUrl('/media/upload'));
      xhr.send(formData);
    });
  },

  /**
   * Lista medios por carpeta con paginación integrada.
   */
  async list(
    params: MediaListParams,
    options?: { headers?: HeadersInit; signal?: AbortSignal }
  ): Promise<MediaListResponse> {
    const { folder, page = 1, limit = 20 } = params;

    const pathUrl = getRequestUrl('/media');
    const baseOrigin = pathUrl.startsWith('/') && !IS_SERVER
      ? window.location.origin
      : undefined;

    const targetUrl = new URL(pathUrl, baseOrigin);
    targetUrl.searchParams.set('folder', folder);
    targetUrl.searchParams.set('page', String(page));
    targetUrl.searchParams.set('limit', String(limit));

    const res = await fetch(targetUrl.toString(), {
      method: 'GET',
      signal: options?.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const textResponse = await res.text().catch(() => '');
    let json: Record<string, unknown> | unknown[] | null = null;

    if (textResponse.trim() !== '') {
      try {
        json = JSON.parse(textResponse) as Record<string, unknown> | unknown[];
      } catch {
        console.warn('[MediaService:list] La respuesta no es un JSON válido:', textResponse);
      }
    }

    if (!res.ok) {
      const message = json && typeof json === 'object' && 'message' in json && typeof json.message === 'string'
        ? json.message
        : `Error ${res.status}: ${res.statusText}`;
      throw new Error(message);
    }

    let normalizedPayload: unknown = null;

    if (json && typeof json === 'object') {
      if (!Array.isArray(json) && 'total' in json && 'data' in json && Array.isArray(json.data)) {
        console.log('[MediaService:list] Estructura nativa perfecta detectada en la raíz.');
        normalizedPayload = json;
      }
      else if (!Array.isArray(json) && 'data' in json && json.data && typeof json.data === 'object' && 'total' in json.data) {
        console.log('[MediaService:list] Estructura de contingencia: Paginación envuelta en json.data');
        normalizedPayload = json.data;
      }
      else if (Array.isArray(json)) {
        console.log('[MediaService:list] Estructura de contingencia: Array plano detectado.');
        normalizedPayload = { total: json.length, pages: 1, data: json };
      }
    }

    if (!normalizedPayload) {
      console.warn('[MediaService:list] No se detectó ninguna estructura conocida. Aplicando fallback vacío.');
      normalizedPayload = { total: 0, pages: 1, data: [] };
    }

    console.log('[MediaService:list] Payload definitivo enviado a Zod:', normalizedPayload);

    try {
      return MediaListResponseSchema.parse(normalizedPayload);
    } catch (zodError) {
      console.error('[MediaService:list] Error de validación estructural de Zod:', zodError);
      throw zodError;
    }
  },

  /**
   * Obtiene la metadata de un medio específico por su ID único de MongoDB.
   */
  async getById(id: string, customHeaders?: HeadersInit): Promise<Media> {
    const res = await fetch(getRequestUrl(`/media?id=${id}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
    });

    return handleResponse(res, MediaSchema, 'getById');
  },

  /**
   * Elimina un medio permanentemente (Cloudinary + Base de Datos).
   */
  async deleteById(id: string, customHeaders?: HeadersInit): Promise<DeleteMediaResponse> {
    const res = await fetch(getRequestUrl(`/media?id=${id}`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
    });

    return handleResponse(res, DeleteMediaResponseSchema, 'deleteById');
  },
};