import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useWebhooks } from "@/contexts/WebhookContext";
import { FileText, Send, CheckCircle, AlertCircle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface LineaAlbaran {
  descripcion: string;
  cantidad: number;
  peso: string;
}

const AlbaranesPage = () => {
  const { config } = useWebhooks();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    numero: `ALB-${Date.now().toString().slice(-6)}`,
    fecha: new Date().toISOString().split("T")[0],
    remitente: "",
    destinatario: "",
    direccionEntrega: "",
    ciudadEntrega: "",
    cpEntrega: "",
    telefonoContacto: "",
    emailCliente: "",
    observaciones: "",
  });
  const [lineas, setLineas] = useState<LineaAlbaran[]>([
    { descripcion: "", cantidad: 1, peso: "" },
  ]);

  const updateField = (key: string, value: string) => setForm({ ...form, [key]: value });

  const addLinea = () => setLineas([...lineas, { descripcion: "", cantidad: 1, peso: "" }]);
  const removeLinea = (i: number) => setLineas(lineas.filter((_, idx) => idx !== i));
  const updateLinea = (i: number, key: keyof LineaAlbaran, value: any) => {
    const updated = [...lineas];
    updated[i] = { ...updated[i], [key]: value };
    setLineas(updated);
  };

  const handleSubmit = async () => {
    if (!config.albaranWebhook) {
      toast.error("Configura el webhook de albaranes en Ajustes");
      return;
    }
    if (!form.remitente || !form.destinatario || !form.direccionEntrega) {
      toast.error("Rellena los campos obligatorios");
      return;
    }
    setSending(true);
    try {
      const response = await fetch(config.albaranWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lineas }),
      });
      if (!response.ok) throw new Error("Error en el webhook");
      toast.success("Albarán enviado correctamente");
      setForm({ ...form, numero: `ALB-${Date.now().toString().slice(-6)}`, remitente: "", destinatario: "", direccionEntrega: "", ciudadEntrega: "", cpEntrega: "", telefonoContacto: "", emailCliente: "", observaciones: "" });
      setLineas([{ descripcion: "", cantidad: 1, peso: "" }]);
    } catch {
      toast.error("Error al enviar el albarán. Verifica el webhook.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout title="Crear Albarán">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
        {!config.albaranWebhook && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-3">
            <AlertCircle className="h-5 w-5 text-brand-yellow" />
            <p className="text-sm text-foreground">
              <strong className="font-heading">Webhook no configurado.</strong> Ve a <a href="/ajustes" className="text-brand-yellow underline font-bold">Ajustes</a> para configurar el webhook de albaranes.
            </p>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card">
          {/* Header */}
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-heading font-extrabold uppercase text-foreground">Albarán {form.numero}</p>
                <p className="text-xs text-muted-foreground">Fecha: {form.fecha}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Remitente & Destinatario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Remitente *</label>
                <input value={form.remitente} onChange={(e) => updateField("remitente", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Nombre o empresa" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Destinatario *</label>
                <input value={form.destinatario} onChange={(e) => updateField("destinatario", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Nombre o empresa" />
              </div>
            </div>

            {/* Delivery address */}
            <div className="space-y-3">
              <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Dirección de entrega *</label>
              <input value={form.direccionEntrega} onChange={(e) => updateField("direccionEntrega", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Calle, número, piso..." />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.ciudadEntrega} onChange={(e) => updateField("ciudadEntrega", e.target.value)} className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Ciudad" />
                <input value={form.cpEntrega} onChange={(e) => updateField("cpEntrega", e.target.value)} className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Código Postal" />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Teléfono contacto</label>
                <input value={form.telefonoContacto} onChange={(e) => updateField("telefonoContacto", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="+34 600 000 000" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Email cliente</label>
                <input value={form.emailCliente} onChange={(e) => updateField("emailCliente", e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="cliente@empresa.com" type="email" />
              </div>
            </div>

            {/* Lines */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Líneas de mercancía</label>
                <button onClick={addLinea} className="flex items-center gap-1 text-xs font-heading font-bold text-brand-yellow hover:underline">
                  <Plus className="h-3 w-3" /> Añadir línea
                </button>
              </div>
              {lineas.map((linea, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input value={linea.descripcion} onChange={(e) => updateLinea(i, "descripcion", e.target.value)} className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Descripción mercancía" />
                  <input type="number" value={linea.cantidad} onChange={(e) => updateLinea(i, "cantidad", parseInt(e.target.value) || 0)} className="w-20 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Cant." />
                  <input value={linea.peso} onChange={(e) => updateLinea(i, "peso", e.target.value)} className="w-28 rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Peso (kg)" />
                  {lineas.length > 1 && (
                    <button onClick={() => removeLinea(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Observations */}
            <div className="space-y-3">
              <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">Observaciones</label>
              <textarea value={form.observaciones} onChange={(e) => updateField("observaciones", e.target.value)} rows={3} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Notas adicionales..." />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3">
            <button
              onClick={handleSubmit}
              disabled={sending}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-heading font-bold uppercase text-sm text-primary-foreground hover:bg-brand-yellow-hover transition-colors disabled:opacity-50"
            >
              {sending ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Crear y Enviar Albarán
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default AlbaranesPage;
