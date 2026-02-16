import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useWebhooks } from "@/contexts/WebhookContext";
import { FileSearch, Upload, Send, AlertCircle, FileText, X } from "lucide-react";
import { toast } from "sonner";

const ExtractorPage = () => {
  const { config } = useWebhooks();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setExtractedData(null);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleSubmit = async () => {
    if (!config.extractorWebhook) {
      toast.error("Configura el webhook del extractor en Ajustes");
      return;
    }
    if (!file) {
      toast.error("Selecciona un archivo primero");
      return;
    }
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(config.extractorWebhook, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error");
      const data = await response.json();
      setExtractedData(data);
      toast.success("Factura procesada correctamente");
    } catch {
      toast.error("Error al procesar. Verifica el webhook.");
      // Mock data for demo
      setExtractedData({
        numero: "FAC-2024-0458",
        fecha: "15/01/2024",
        emisor: "Transportes García S.L.",
        cif: "B12345678",
        baseImponible: "€1,250.00",
        iva: "€262.50",
        total: "€1,512.50",
      });
    } finally {
      setSending(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setExtractedData(null);
  };

  return (
    <AppLayout title="Extractor de Facturas">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
        {!config.extractorWebhook && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-3">
            <AlertCircle className="h-5 w-5 text-brand-yellow" />
            <p className="text-sm text-foreground">
              <strong className="font-heading">Webhook no configurado.</strong> Ve a <a href="/ajustes" className="text-brand-yellow underline font-bold">Ajustes</a> para configurarlo.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload area */}
          <div className="space-y-4">
            <h2 className="text-base font-heading font-extrabold uppercase">Subir Factura</h2>
            
            {!file ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all cursor-pointer ${
                  dragOver ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                }`}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-heading font-bold uppercase text-foreground mb-1">Arrastra tu factura aquí</p>
                <p className="text-sm text-muted-foreground">o haz clic para seleccionar</p>
                <p className="text-xs text-muted-foreground mt-2">PDF, JPG, PNG</p>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-brand-yellow" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={clearFile} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {preview && (
                  <img src={preview} alt="Preview" className="w-full rounded-lg border border-border" />
                )}

                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-heading font-bold uppercase text-sm text-primary-foreground hover:bg-brand-yellow-hover transition-colors disabled:opacity-50"
                >
                  {sending ? "Procesando..." : <><Send className="h-4 w-4" /> Extraer Datos</>}
                </button>
              </div>
            )}
          </div>

          {/* Extracted Data */}
          <div className="space-y-4">
            <h2 className="text-base font-heading font-extrabold uppercase">Datos Extraídos</h2>
            
            {extractedData ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-border bg-card p-5 space-y-3"
              >
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-xs font-heading font-bold uppercase text-muted-foreground tracking-wider">{key}</span>
                    <span className="font-heading font-bold text-sm text-foreground">{value}</span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
                <FileSearch className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">Sube una factura para extraer sus datos automáticamente</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default ExtractorPage;
