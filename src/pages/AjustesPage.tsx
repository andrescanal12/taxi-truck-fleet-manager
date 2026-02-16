import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useWebhooks } from "@/contexts/WebhookContext";
import { Settings, Save, CheckCircle, Link2 } from "lucide-react";
import { toast } from "sonner";

const webhookFields = [
  { key: "albaranWebhook" as const, label: "Webhook Albaranes", description: "Se ejecuta al crear un albarán. Envía los datos al flujo de n8n para enviar el albarán por email al cliente." },
  { key: "facturaWebhook" as const, label: "Webhook Facturas", description: "Se ejecuta al generar una factura. Conecta con n8n para procesar, almacenar y enviar la factura." },
  { key: "extractorWebhook" as const, label: "Webhook Extractor", description: "Se ejecuta al subir una factura para extracción OCR. Envía el archivo a n8n para procesamiento." },
];

const AjustesPage = () => {
  const { config, updateConfig } = useWebhooks();
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    webhookFields.forEach(({ key }) => {
      updateConfig(key, localConfig[key]);
    });
    toast.success("Configuración guardada correctamente");
  };

  return (
    <AppLayout title="Ajustes">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Settings className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="font-heading font-extrabold uppercase text-foreground">Webhooks n8n</p>
              <p className="text-xs text-muted-foreground">Configura las URLs de tus automatizaciones</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {webhookFields.map(({ key, label, description }) => (
              <div key={key} className="space-y-2">
                <label className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                  <Link2 className="h-3 w-3" />
                  {label}
                </label>
                <input
                  value={localConfig[key]}
                  onChange={(e) => setLocalConfig({ ...localConfig, [key]: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://tu-n8n.com/webhook/..."
                />
                <p className="text-xs text-muted-foreground">{description}</p>
                {localConfig[key] && (
                  <div className="flex items-center gap-1 text-xs text-brand-success">
                    <CheckCircle className="h-3 w-3" /> Configurado
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border px-6 py-4 flex items-center justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-heading font-bold uppercase text-sm text-primary-foreground hover:bg-brand-yellow-hover transition-colors"
            >
              <Save className="h-4 w-4" />
              Guardar Configuración
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading font-extrabold uppercase text-foreground mb-3">¿Cómo conectar con n8n?</h3>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Crea un flujo en n8n con un nodo <strong className="text-foreground">Webhook</strong> como trigger</li>
            <li>Configura el método como <strong className="text-foreground">POST</strong></li>
            <li>Copia la URL del webhook y pégala arriba</li>
            <li>Añade los nodos que necesites (enviar email, guardar en Google Sheets, etc.)</li>
            <li>Activa el flujo en n8n</li>
          </ol>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default AjustesPage;
