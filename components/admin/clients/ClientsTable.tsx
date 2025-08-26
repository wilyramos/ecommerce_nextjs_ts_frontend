import type { UsersAPIResponse } from "@/src/schemas";
import ClientsTableFilters from "./ClientsTableFilters";

type Props = {
    clients: UsersAPIResponse;
};

export default function ClientsTable({ clients }: Props) {
    const clientes = clients.users;

    //   const clearFilters = () => {
    //     // Logic to clear filters can be implemented here
    //     console.log("Filters cleared");
    //   }

    return (

        <>
            <div>

            </div>

            <div className="overflow-x-auto bg-white mt-2">
                <table className="w-full text-sm text-left">
                    <tbody className="divide-y">
                        {/* Fila con inputs de búsqueda */}
                        <ClientsTableFilters />

                        {/* Datos */}
                        {clientes.map((client) => (
                            <tr key={client._id} className="hover:bg-gray-100 ">
                                <td className="px-4 py-2">{client.nombre}</td>
                                <td className="px-4 py-2">{client.email}</td>
                                <td className="px-4 py-2">{client.telefono}</td>
                                <td className="px-4 py-2">{client.numeroDocumento}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
