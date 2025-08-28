// src/components/ClientsTable.tsx
import type { UsersAPIResponse } from "@/src/schemas";
import ClientsTableFilters from "./ClientsTableFilters";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

type Props = {
    clients: UsersAPIResponse;
};

export default function ClientsTable({ clients }: Props) {
    const clientes = clients.users;

    return (
        <div className="py-4">
            <Table>
                <TableHeader>
                    {/* filtros en la cabecera */}
                    <ClientsTableFilters />
                </TableHeader>

                <TableBody>
                    {clientes.map((client) => (
                        <TableRow key={client._id}>
                            <TableCell>{client.nombre}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.telefono}</TableCell>
                            <TableCell>{client.numeroDocumento}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
