import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    KR: any;
  }
}

export function useIzipay() {
  const formRef = useRef<HTMLDivElement>(null);
  const [krReady, setKrReady] = useState(false);

  useEffect(() => {
    if (window.KR) {
      setKrReady(true);
      return;
    }

    // Verificar si ya están los scripts (para evitar agregar varias veces)
    if (!document.querySelector('script[src*="kr-payment-form.min.js"]')) {
      const krScript = document.createElement("script");
      krScript.src = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js";
      krScript.async = true;
      krScript.setAttribute("kr-public-key", "testpublickey_W20fvKe1vMLRXBXo93GveTQQyaW7brkcvKCyKYGTZUUKR");
      krScript.setAttribute("kr-post-url-success", "/success");
      krScript.setAttribute("kr-language", "es-ES");
      krScript.onload = () => {
        if (window.KR) setKrReady(true);
      };
      document.body.appendChild(krScript);
    }

    if (!document.querySelector('script[src*="ext/neon.js"]')) {
      const neonScript = document.createElement("script");
      neonScript.src = "https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/neon.js";
      neonScript.async = true;
      document.body.appendChild(neonScript);
    }

    if (!document.querySelector('link[href*="neon-reset.min.css"]')) {
      const neonCss = document.createElement("link");
      neonCss.rel = "stylesheet";
      neonCss.href = "https://static.payzen.eu/static/js/krypton-client/V4.0/ext/neon-reset.min.css";
      document.head.appendChild(neonCss);
    }
  }, []);

  function setFormToken(token: string) {
    if (formRef.current) {
      formRef.current.setAttribute("kr-form-token", token);
    }
  }


  function openPopin() {
    if (window.KR && krReady) {
      window.KR.openPopin();
    }
  }

  return {
    formRef,
    krReady,
    setFormToken,
    openPopin,
  };
}
