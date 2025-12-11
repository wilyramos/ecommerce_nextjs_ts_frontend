// src/components/ClientsTable.tsx
import type { UsersAPIResponse } from "@/src/schemas";
import ClientsTableFilters from "./ClientsTableFilters";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

type Props = { clients: UsersAPIResponse };

export default function ClientsTable({ clients }: Props) {
    const clientes = clients.users;

    return (
        <div className="w-full overflow-auto text-xs text-zinc-600 bg-gray-50">
            <Table className="text-zinc-600">
                <TableHeader className="sticky top-0 bg-gray-50 shadow-sm border-b border-zinc-400">
                    <ClientsTableFilters />
                </TableHeader>

                <TableBody>
                    {clientes.map((client) => (
                        <TableRow key={client._id} className="hover:bg-gray-50 text-sm">
                            <TableCell className="text-black">{client.nombre}</TableCell>
                            <TableCell className="text-zinc-600">{client.email}</TableCell>
                            <TableCell className="text-zinc-600">{client.telefono}</TableCell>
                            <TableCell className="text-zinc-600">{client.numeroDocumento}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
