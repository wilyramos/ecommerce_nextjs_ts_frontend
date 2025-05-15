

// Format PEN
export function formatCurrency(value: number): string {

    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
  
}