import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useWebhooks } from "@/contexts/WebhookContext";
import { FileSearch, Upload, Send, AlertCircle, FileText, X, Camera } from "lucide-react";
import { toast } from "sonner";

const ExtractorPage = () => {
  const { config } = useWebhooks();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Effect to assign stream to video element when camera opens
  useEffect(() => {
    if (cameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOpen, stream]);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      setCameraOpen(true);
    } catch (error) {
      toast.error("No se pudo acceder a la cámara");
      console.error(error);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `factura-${Date.now()}.jpg`, { type: "image/jpeg" });
        handleFile(file);
        closeCamera();
        toast.success("Foto capturada correctamente");
      }
    }, "image/jpeg", 0.95);
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraOpen(false);
  };

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
              <>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
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

                {/* Camera Button */}
                <button
                  onClick={openCamera}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-secondary border border-border px-4 py-3 font-heading font-bold uppercase text-sm text-white hover:bg-muted transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  Tomar Foto
                </button>
              </>
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

      {/* Camera Modal */}
      <AnimatePresence>
        {cameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeCamera}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                <h3 className="font-heading font-bold text-lg">Capturar Factura</h3>
                <button
                  onClick={closeCamera}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video Preview */}
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    video.play().catch(err => console.error("Error playing video:", err));
                  }}
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Controls */}
              <div className="p-6 flex justify-center gap-4">
                <button
                  onClick={capturePhoto}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-heading font-bold uppercase text-sm text-primary-foreground hover:bg-brand-yellow-hover transition-colors shadow-lg"
                >
                  <Camera className="h-5 w-5" />
                  Capturar
                </button>
                <button
                  onClick={closeCamera}
                  className="flex items-center justify-center gap-2 rounded-lg bg-secondary border border-border px-6 py-3 font-heading font-bold uppercase text-sm text-white hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default ExtractorPage;
