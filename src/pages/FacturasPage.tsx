import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useWebhooks } from "@/contexts/WebhookContext";
import { FilePlus, Send, Plus, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface LineaFactura {
  concepto: string;
  cantidad: number;
  precioUnitario: number;
}

const FacturasPage = () => {
  const { config } = useWebhooks();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    numero: `FAC-${Date.now().toString().slice(-6)}`,
    fecha: new Date().toISOString().split("T")[0],
    fechaVencimiento: "",
    emisor: "",
    cifEmisor: "",
    cliente: "",
    cifCliente: "",
    direccionCliente: "",
    emailCliente: "",
    iva: 21,
    notas: "",
  });
  const [lineas, setLineas] = useState<LineaFactura[]>([
    { concepto: "", cantidad: 1, precioUnitario: 0 },
  ]);

  const updateField = (key: string, value: any) => setForm({ ...form, [key]: value });
  const addLinea = () => setLineas([...lineas, { concepto: "", cantidad: 1, precioUnitario: 0 }]);
  const removeLinea = (i: number) => setLineas(lineas.filter((_, idx) => idx !== i));
  const updateLinea = (i: number, key: keyof LineaFactura, value: any) => {
    const updated = [...lineas];
    updated[i] = { ...updated[i], [key]: value };
    setLineas(updated);
  };

  const subtotal = lineas.reduce((acc, l) => acc + l.cantidad * l.precioUnitario, 0);
  const ivaAmount = subtotal * (form.iva / 100);
  const total = subtotal + ivaAmount;

  const handleSubmit = async () => {
    if (!config.facturaWebhook) {
      toast.error("Configura el webhook de facturas en Ajustes");
      return;
    }
    if (!form.emisor || !form.cliente) {
      toast.error("Rellena los campos obligatorios");
      return;
    }
    setSending(true);
    try {
      const response = await fetch(config.facturaWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lineas, subtotal, ivaAmount, total }),
      });
      if (!response.ok) throw new Error("Error");
      toast.success("Factura enviada correctamente");
    } catch {
      toast.error("Error al enviar la factura. Verifica el webhook.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout title="Crear Factura">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
        {!config.facturaWebhook && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-3">
            <AlertCircle className="h-5 w-5 text-brand-yellow" />
            <p className="text-sm text-foreground">
              <strong className="font-heading">Webhook no configurado.</strong> Ve a <a href="/ajustes" className="text-brand-yellow underline font-bold">Ajustes</a> para configurar el webhook de facturas.
            </p>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <FilePlus className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="font-heading font-extrabold uppercase text-foreground">Factura {form.numero}</p>
              <p className="text-xs text-muted-foreground">Fecha: {form.fecha}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Emisor & Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Emisor *</label>
                <input value={form.emisor} onChange={(e) => updateField("emisor", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Nombre / Empresa" />
                <input value={form.cifEmisor} onChange={(e) => updateField("cifEmisor", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="CIF / NIF" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Cliente *</label>
                <input value={form.cliente} onChange={(e) => updateField("cliente", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Nombre / Empresa" />
                <input value={form.cifCliente} onChange={(e) => updateField("cifCliente", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="CIF / NIF" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Dirección cliente</label>
                <input value={form.direccionCliente} onChange={(e) => updateField("direccionCliente", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Dirección completa" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Email cliente</label>
                <input value={form.emailCliente} onChange={(e) => updateField("emailCliente", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="cliente@empresa.com" type="email" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Fecha vencimiento</label>
                <input type="date" value={form.fechaVencimiento} onChange={(e) => updateField("fechaVencimiento", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">IVA (%)</label>
                <input type="number" value={form.iva} onChange={(e) => updateField("iva", parseFloat(e.target.value) || 0)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            {/* Lines */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Conceptos</label>
                <button onClick={addLinea} className="flex items-center gap-1 text-xs font-heading font-bold text-brand-yellow hover:underline">
                  <Plus className="h-3 w-3" /> Añadir
                </button>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left text-xs font-heading font-bold uppercase text-muted-foreground">Concepto</th>
                      <th className="px-4 py-2 text-center text-xs font-heading font-bold uppercase text-muted-foreground w-20">Cant.</th>
                      <th className="px-4 py-2 text-right text-xs font-heading font-bold uppercase text-muted-foreground w-28">Precio</th>
                      <th className="px-4 py-2 text-right text-xs font-heading font-bold uppercase text-muted-foreground w-28">Total</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineas.map((l, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-4 py-2">
                          <input value={l.concepto} onChange={(e) => updateLinea(i, "concepto", e.target.value)} className="w-full bg-transparent text-sm focus:outline-none" placeholder="Descripción del servicio" />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={l.cantidad} onChange={(e) => updateLinea(i, "cantidad", parseInt(e.target.value) || 0)} className="w-full bg-transparent text-sm text-center focus:outline-none" />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" step="0.01" value={l.precioUnitario} onChange={(e) => updateLinea(i, "precioUnitario", parseFloat(e.target.value) || 0)} className="w-full bg-transparent text-sm text-right focus:outline-none" placeholder="0.00" />
                        </td>
                        <td className="px-4 py-2 text-right font-heading font-bold">€{(l.cantidad * l.precioUnitario).toFixed(2)}</td>
                        <td className="px-2">
                          {lineas.length > 1 && (
                            <button onClick={() => removeLinea(i)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-heading font-bold">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>IVA ({form.iva}%)</span>
                  <span className="font-heading font-bold">€{ivaAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-foreground">
                  <span className="font-heading font-extrabold uppercase">Total</span>
                  <span className="font-heading font-extrabold text-lg">€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Notas</label>
              <textarea value={form.notas} onChange={(e) => updateField("notas", e.target.value)} rows={2} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Condiciones de pago, notas adicionales..." />
            </div>
          </div>

          <div className="border-t border-border px-6 py-4 flex items-center justify-end">
            <button onClick={handleSubmit} disabled={sending} className="flex items-center gap-2 rounded-lg bg-secondary px-6 py-2.5 font-heading font-bold uppercase text-sm text-secondary-foreground hover:bg-secondary/90 transition-colors disabled:opacity-50">
              {sending ? "Enviando..." : <><Send className="h-4 w-4" /> Crear y Enviar Factura</>}
            </button>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default FacturasPage;
