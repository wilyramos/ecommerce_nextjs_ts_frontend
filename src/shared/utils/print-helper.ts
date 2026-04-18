/**
 * Utilidad para imprimir tickets de venta de forma fluida.
 * Crea un iframe invisible, carga el PDF desde el Route Handler de Next.js
 * y dispara el diálogo de impresión del sistema.
 */
export const printTicket = (saleId: string): void => {
  // 1. Definir la URL de nuestro Route Handler (Next.js 15)
  const ticketUrl = `/api/sales/${saleId}/ticket`;

  // 2. Crear un iframe oculto para no afectar la interfaz del POS
  const iframe = document.createElement("iframe");
  
  // Estilos para que sea invisible pero funcional
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";
  
  // Asignar la fuente del PDF
  iframe.src = ticketUrl;

  // 3. Insertar el iframe en el documento
  document.body.appendChild(iframe);

  // 4. Escuchar cuando el PDF termine de cargar
  iframe.onload = () => {
    if (!iframe.contentWindow) {
      console.error("No se pudo acceder al contenido del iframe de impresión.");
      return;
    }

    // Dar un pequeño delay para asegurar que el motor de renderizado del PDF esté listo
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (error) {
        console.error("Error al intentar disparar la impresión:", error);
      }

      // 5. Limpieza: Eliminar el iframe del DOM después de que el usuario interactúe
      // Usamos un tiempo prudencial para no interrumpir el flujo de datos al driver de la impresora
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }, 500);
  };
};