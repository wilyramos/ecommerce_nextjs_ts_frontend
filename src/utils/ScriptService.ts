// frontend/src/utils/script.ts


declare global {
    interface Window {
        [key: string]: unknown;
    }
}

export default class ScriptService {
    
    private scriptId: string;
    private nameFunction: string;
    private scriptSrc: string;

    constructor(scriptId: string, nameFunction: string, scriptSrc: string) {
        this.scriptId = scriptId;
        this.nameFunction = nameFunction;
        this.scriptSrc = scriptSrc;
    }

    appendScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined') {
                return reject(new Error("ScriptService can only be used in the browser"));
            }

            // Evitar duplicación del script
            if (!document.getElementById(this.scriptId)) {
                const script = document.createElement("script");
                script.setAttribute("src", this.scriptSrc);
                script.setAttribute("id", this.scriptId);
                script.async = true;
                document.body.appendChild(script);
            }

            this.checkScript(resolve, reject);
        });
    }

    private checkScript(resolve: () => void, reject: (err: Error) => void): void {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (attempts > 10) {
                clearInterval(interval);
                reject(new Error("Superó el límite de verificaciones"));
            }

            if ((window)[this.nameFunction]) {
                clearInterval(interval);
                resolve();
            }
        }, 1000);
    }

    destroy(): void {
        const script = document.getElementById(this.scriptId);
        if (script) {
            script.remove();
        }

        // Eliminar referencia en window
        delete (window)[this.nameFunction];
    }
}
