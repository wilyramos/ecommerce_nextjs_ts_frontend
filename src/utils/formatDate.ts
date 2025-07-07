// src/utils/date.ts
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es"); // Establece español como idioma por defecto

export function formatDate(dateString: string | Date, format: string = "D [de] MMMM YYYY, HH:mm") {
    return dayjs(dateString).format(format);
}
