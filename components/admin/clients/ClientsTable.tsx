import type { UsersAPIResponse } from "@/src/schemas";
import ClientsTableFilters from "./ClientsTableFilters";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

type Props = { clients: UsersAPIResponse };

export default function ClientsTable({ clients }: Props) {
    const clientes = clients.users;

    return (
        <div className="w-full b overflow-hidden ">
            <Table>
                <TableHeader className="bg-background-secondary/50">
                    <TableRow className="hover:bg-transparent border-b border-border/60">
                        <TableHead className="font-bold text-xs uppercase text-foreground">Nombre</TableHead>
                        <TableHead className="font-bold text-xs uppercase text-foreground">Email</TableHead>
                        <TableHead className="font-bold text-xs uppercase text-foreground">Teléfono</TableHead>
                        <TableHead className="font-bold text-xs uppercase text-foreground">Documento</TableHead>
                        <TableHead className="font-bold text-xs uppercase text-foreground">Rol</TableHead>
                    </TableRow>
                    <ClientsTableFilters />
                </TableHeader>

                <TableBody className="divide-y divide-border/40">
                    {clientes.length > 0 ? (
                        clientes.map((client) => (
                            <TableRow key={client._id} className="hover:bg-background-secondary/40 transition-colors">
                                <TableCell className="text-sm font-bold text-foreground">
                                    {client.nombre} {client.apellidos || ""}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{client.email}</TableCell>
                                <TableCell className="text-sm text-muted-foreground font-mono">{client.telefono || "—"}</TableCell>
                                <TableCell className="text-sm text-muted-foreground font-mono">
                                    {client.numeroDocumento || "—"}
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex px-2 py-0.5 rounded-sm bg-background-secondary text-[10px] font-bold uppercase tracking-wider text-action-cta border border-action-cta/10">
                                        {client.rol}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-medium text-xs">
                                No se encontraron clientes registrados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}