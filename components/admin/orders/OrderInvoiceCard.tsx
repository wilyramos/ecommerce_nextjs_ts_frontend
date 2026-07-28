// File: frontend/components/admin/orders/OrderInvoiceCard.tsx
"use client";

import { useState, useTransition } from "react";
import { generateBoletaAction, generateCreditNoteAction, generateVoidAction } from "@/actions/order-actions";
import { type InvoiceInfo } from "@/src/schemas/order.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink, Loader2, CheckCircle2, AlertCircle, Eye, RotateCcw, Ban } from "lucide-react";
import { toast } from "sonner";

interface Props {
    orderId: string;
    invoice?: InvoiceInfo;
    creditNote?: InvoiceInfo;
    voidInfo?: InvoiceInfo;
}

export default function OrderInvoiceCard({ orderId, invoice, creditNote, voidInfo }: Props) {
    const [isPending, startTransition] = useTransition();
    const [ncReason, setNcReason] = useState("");
    const [voidReason, setVoidReason] = useState("");
    const [showNcForm, setShowNcForm] = useState(false);
    const [showVoidForm, setShowVoidForm] = useState(false);

    const handleGenerate = () => {
        startTransition(async () => {
            const res = await generateBoletaAction(orderId);
            if (res.ok) {
                toast.success("Boleta de Venta Electrónica emitida con éxito");
            } else {
                toast.error(res.error || "No se pudo emitir la boleta");
            }
        });
    };

    const handleCreditNote = () => {
        if (!ncReason.trim()) {
            toast.error("Ingresa un motivo para la Nota de Crédito");
            return;
        }
        startTransition(async () => {
            const res = await generateCreditNoteAction(orderId, ncReason);
            if (res.ok) {
                toast.success("Nota de Crédito generada con éxito");
                setShowNcForm(false);
            } else {
                toast.error(res.error || "No se pudo generar la Nota de Crédito");
            }
        });
    };

    const handleVoid = () => {
        if (!voidReason.trim()) {
            toast.error("Ingresa un motivo para la Comunicación de Baja");
            return;
        }
        startTransition(async () => {
            const res = await generateVoidAction(orderId, voidReason);
            if (res.ok) {
                toast.success("Comunicación de baja enviada con éxito");
                setShowVoidForm(false);
            } else {
                toast.error(res.error || "No se pudo anular el comprobante");
            }
        });
    };

    const pdfDirectLink = invoice?.pdfUrl || (invoice?.nubefactEnlace ? `${invoice.nubefactEnlace}.pdf` : null);
    const ncPdfLink = creditNote?.pdfUrl || (creditNote?.nubefactEnlace ? `${creditNote.nubefactEnlace}.pdf` : null);

    // Estados de control para la interfaz
    const isAnulado = Boolean(voidInfo);
    const hasCreditNote = Boolean(creditNote);
    const canPerformActions = invoice && !isAnulado && !hasCreditNote;

    return (
        <Card>
            <CardHeader className="py-3">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-primary" /> Facturación Electrónica (SUNAT)
                    </span>
                    {invoice && !isAnulado && !hasCreditNote && (
                        <Badge variant="outline" className="text-[9px] border-emerald-500 text-emerald-600 bg-emerald-50 font-bold uppercase">
                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Aceptado
                        </Badge>
                    )}
                    {hasCreditNote && (
                        <Badge variant="outline" className="text-[9px] border-amber-500 text-amber-600 bg-amber-50 font-bold uppercase">
                            <RotateCcw className="w-2.5 h-2.5 mr-1" /> Con Nota de Crédito
                        </Badge>
                    )}
                    {isAnulado && (
                        <Badge variant="destructive" className="text-[9px] font-bold uppercase">
                            <Ban className="w-2.5 h-2.5 mr-1" /> Anulado / Baja
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {invoice ? (
                    <div className="space-y-3">
                        {/* Detalle de la Boleta Principal */}
                        <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-md border border-border/60">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Boleta de Venta Electrónica</p>
                                <p className="text-sm font-bold font-mono text-foreground mt-0.5 select-all">
                                    {invoice.serie}-{String(invoice.numero).padStart(8, '0')}
                                </p>
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">
                                {new Date(invoice.generatedAt).toLocaleDateString("es-PE")}
                            </span>
                        </div>

                        {pdfDirectLink && (
                            <a
                                href={pdfDirectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2 px-3 rounded-md transition-colors w-full shadow-xs"
                            >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Ver PDF de Boleta</span>
                                <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                            </a>
                        )}

                        {/* Bloque Informativo: Nota de Crédito Emitida */}
                        {hasCreditNote && creditNote && (
                            <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-md space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
                                        Nota de Crédito Emitida
                                    </span>
                                    <span className="text-xs font-mono font-bold text-foreground">
                                        {creditNote.serie}-{String(creditNote.numero).padStart(8, '0')}
                                    </span>
                                </div>
                                {ncPdfLink && (
                                    <a
                                        href={ncPdfLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                                    >
                                        <Eye className="w-3 h-3" /> Ver PDF Nota de Crédito
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Bloque Informativo: Comunicación de Baja (Anulación) */}
                        {isAnulado && voidInfo && (
                            <div className="bg-destructive/10 border border-destructive/20 p-2.5 rounded-md space-y-1 text-xs text-destructive font-medium">
                                <p className="font-bold">Comprobante Anulado mediante Baja SUNAT</p>
                                {voidInfo.sunatTicketNumero && (
                                    <p className="font-mono text-[10px]">Ticket SUNAT: {voidInfo.sunatTicketNumero}</p>
                                )}
                                <p className="text-[11px]">{voidInfo.sunatDescription || "El comprobante fue dado de baja."}</p>
                            </div>
                        )}

                        {/* Acciones Correctivas (Visibles ÚNICAMENTE cuando la Boleta está Aceptada y Activa) */}
                        {canPerformActions && (
                            <div className="pt-2 border-t border-border/60 space-y-2">
                                {!showNcForm && !showVoidForm && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-[11px] h-7 font-bold text-amber-600 border-amber-300 hover:bg-amber-50"
                                            onClick={() => setShowNcForm(true)}
                                        >
                                            <RotateCcw className="w-3 h-3 mr-1" /> Nota de Crédito
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-[11px] h-7 font-bold text-destructive border-destructive/40 hover:bg-destructive/10"
                                            onClick={() => setShowVoidForm(true)}
                                        >
                                            <Ban className="w-3 h-3 mr-1" /> Comunicación Baja
                                        </Button>
                                    </div>
                                )}

                                {showNcForm && (
                                    <div className="space-y-2 bg-muted/60 p-2 rounded border">
                                        <p className="text-[11px] font-bold">Generar Nota de Crédito</p>
                                        <input
                                            type="text"
                                            placeholder="Motivo (Ej. Devolución total)"
                                            value={ncReason}
                                            onChange={(e) => setNcReason(e.target.value)}
                                            className="w-full text-xs p-1.5 rounded border bg-background"
                                        />
                                        <div className="flex gap-2">
                                            <Button size="sm" className="h-7 text-xs" onClick={handleCreditNote} disabled={isPending}>
                                                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Emitir NC"}
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowNcForm(false)}>
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {showVoidForm && (
                                    <div className="space-y-2 bg-muted/60 p-2 rounded border">
                                        <p className="text-[11px] font-bold">Enviar Comunicación de Baja</p>
                                        <input
                                            type="text"
                                            placeholder="Motivo (Ej. Error de datos)"
                                            value={voidReason}
                                            onChange={(e) => setVoidReason(e.target.value)}
                                            className="w-full text-xs p-1.5 rounded border bg-background"
                                        />
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={handleVoid} disabled={isPending}>
                                                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Anular con Baja"}
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowVoidForm(false)}>
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-md text-amber-800 dark:text-amber-400">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-medium leading-tight">
                                Esta orden aún no cuenta con una Boleta Electrónica generada en SUNAT.
                            </p>
                        </div>

                        <Button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isPending}
                            className="w-full h-8 text-xs font-bold uppercase tracking-wider"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> Emitiendo en Nubefact...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-3.5 h-3.5 mr-2" /> Emitir Boleta Electrónica
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}