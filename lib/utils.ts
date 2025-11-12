import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}



export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "PEN",
    }).format(amount);
}

export function getProvincesByDepartment(department: string): string[] {

    const data = [
        { department: "Amazonas", provinces: ["Chachapoyas", "Bagua", "Bongará", "Condorcanqui", "Luya", "Rodríguez de Mendoza", "Utcubamba"] },
        { department: "Áncash", provinces: ["Huaraz", "Aija", "Antonio Raymondi", "Asunción", "Bolognesi", "Carhuaz", "Carlos Fermín Fitzcarrald", "Casma", "Corongo", "Huari", "Huarmey", "Huaylas", "Mariscal Luzuriaga", "Ocros", "Pallasca", "Pomabamba", "Recuay", "Santa", "Sihuas", "Yungay"] },
        { department: "Ucayali", provinces: ["Atalaya", "Coronel Portillo", "Padre Abad", "Purús"] }
    ];

    return data.find(item => item.department === department)?.provinces || [];
}

export function getSearchHistory(): string[] {
    if (typeof window === "undefined") return [];
    const saved = JSON.parse(localStorage.getItem("search-history") || "[]");
    return Array.isArray(saved) ? saved : [];
}

export function saveSearchTerm(term: string): void {
    if (typeof window === "undefined" || !term) return;
    const history = getSearchHistory();
    const updated = [term, ...history.filter(h => h !== term)].slice(0, 5);
    localStorage.setItem("search-history", JSON.stringify(updated));
}

export function getDeliveryRange(days: number): string {
    const today = new Date();

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + days);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 1);

    const format = (date: Date) =>
        date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
        });

    return `${format(startDate)} – ${format(endDate)}`;
}
