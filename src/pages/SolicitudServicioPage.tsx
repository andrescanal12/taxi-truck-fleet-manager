import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Package,
    Truck,
    Send,
    Phone,
    User,
    Weight,
    FileText,
    CheckCircle2,
    ArrowRight,
    Loader2,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useServicios, TipoCarga } from "@/contexts/ServiciosContext";

const tiposCarga: { value: TipoCarga; label: string; icon: string }[] = [
    { value: "mudanza", label: "Mudanza", icon: "🏠" },
    { value: "paqueteria", label: "Paquetería", icon: "📦" },
    { value: "material_construccion", label: "Material Construcción", icon: "🏗️" },
    { value: "electrodomesticos", label: "Electrodomésticos", icon: "🔌" },
    { value: "maquinaria", label: "Maquinaria", icon: "⚙️" },
    { value: "alimentacion", label: "Alimentación", icon: "🍎" },
    { value: "otro", label: "Otro", icon: "📋" },
];

const SolicitudServicioPage = () => {
    const { crearServicio, trabajadoresDisponibles } = useServicios();
    const [enviado, setEnviado] = useState(false);
    const [idServicio, setIdServicio] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [paso, setPaso] = useState(1);

    const [form, setForm] = useState({
        clienteNombre: "",
        clienteTelefono: "",
        origen: "",
        destino: "",
        tipoCarga: "" as TipoCarga | "",
        descripcionCarga: "",
        pesoEstimado: "",
        notas: "",
    });

    const update = (key: string, value: string) =>
        setForm((p) => ({ ...p, [key]: value }));

    const puedeSiguiente = () => {
        if (paso === 1) return form.clienteNombre && form.clienteTelefono;
        if (paso === 2) return form.origen && form.destino;
        if (paso === 3) return form.tipoCarga && form.descripcionCarga;
        return true;
    };

    const handleSubmit = () => {
        if (!form.tipoCarga) return;
        setEnviando(true);
        setTimeout(() => {
            const id = crearServicio({
                clienteId: `CLI-${Date.now()}`,
                clienteNombre: form.clienteNombre,
                clienteTelefono: form.clienteTelefono,
                origen: form.origen,
                destino: form.destino,
                tipoCarga: form.tipoCarga as TipoCarga,
                descripcionCarga: form.descripcionCarga,
                pesoEstimado: form.pesoEstimado,
                notas: form.notas,
                costoEstimado: Math.floor(Math.random() * 300) + 80,
            });
            setIdServicio(id);
            setEnviando(false);
            setEnviado(true);
        }, 1500);
    };

    if (enviado) {
        return (
            <AppLayout title="Solicitud Enviada">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-success/20"
                    >
                        <CheckCircle2 className="h-12 w-12 text-brand-success" />
                    </motion.div>
                    <h2 className="text-2xl font-heading font-extrabold mb-2">
                        ¡Servicio Solicitado!
                    </h2>
                    <p className="text-muted-foreground mb-4 max-w-md">
                        Tu solicitud ha sido registrada y se está notificando a los{" "}
                        <span className="font-bold text-brand-yellow">
                            {trabajadoresDisponibles.length} conductores disponibles
                        </span>{" "}
                        en tu zona.
                    </p>

                    <div className="rounded-xl border border-border bg-card p-6 mb-6 w-full max-w-sm">
                        <p className="text-xs text-muted-foreground uppercase font-heading font-bold mb-1">
                            ID del Servicio
                        </p>
                        <p className="text-2xl font-heading font-extrabold text-primary">
                            {idServicio}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => {
                                setEnviado(false);
                                setPaso(1);
                                setForm({
                                    clienteNombre: "",
                                    clienteTelefono: "",
                                    origen: "",
                                    destino: "",
                                    tipoCarga: "",
                                    descripcionCarga: "",
                                    pesoEstimado: "",
                                    notas: "",
                                });
                            }}
                            className="rounded-lg bg-secondary px-6 py-3 text-sm font-heading font-bold uppercase text-secondary-foreground hover:bg-secondary/80 transition-colors"
                        >
                            Nueva Solicitud
                        </button>
                        <a
                            href="/seguimiento"
                            className="rounded-lg bg-primary px-6 py-3 text-sm font-heading font-bold uppercase text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                            Seguir en Tiempo Real
                        </a>
                    </div>
                </motion.div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Solicitar Servicio">
            {/* Progress steps */}
            <div className="mb-8">
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={() => s < paso && setPaso(s)}
                                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-heading font-bold transition-all ${s === paso
                                        ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                                        : s < paso
                                            ? "bg-brand-success text-white"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {s < paso ? "✓" : s}
                            </button>
                            {s < 3 && (
                                <div
                                    className={`hidden sm:block h-0.5 w-12 rounded-full transition-colors ${s < paso ? "bg-brand-success" : "bg-muted"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-center text-sm text-muted-foreground font-heading font-bold uppercase">
                    {paso === 1 && "Datos del Cliente"}
                    {paso === 2 && "Origen y Destino"}
                    {paso === 3 && "Detalles de la Carga"}
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* Step 1: Client data */}
                    {paso === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="space-y-5"
                        >
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h3 className="text-lg font-heading font-extrabold uppercase mb-5 flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Información del Cliente
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-heading font-bold uppercase text-muted-foreground mb-1.5">
                                            Nombre Completo / Empresa
                                        </label>
                                        <input
                                            type="text"
                                            value={form.clienteNombre}
                                            onChange={(e) => update("clienteNombre", e.target.value)}
                                            placeholder="Ej: María García López"
                                            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-heading font-bold uppercase text-muted-foreground mb-1.5">
                                            <Phone className="inline h-3 w-3 mr-1" />
                                            Teléfono de Contacto
                                        </label>
                                        <input
                                            type="tel"
                                            value={form.clienteTelefono}
                                            onChange={(e) =>
                                                update("clienteTelefono", e.target.value)
                                            }
                                            placeholder="+34 612 345 678"
                                            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Origin/Destination */}
                    {paso === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="space-y-5"
                        >
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h3 className="text-lg font-heading font-extrabold uppercase mb-5 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Ruta del Servicio
                                </h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <label className="block text-xs font-heading font-bold uppercase text-muted-foreground mb-1.5">
                                            📍 Punto de Origen
                                        </label>
                                        <input
                                            type="text"
                                            value={form.origen}
                                            onChange={(e) => update("origen", e.target.value)}
                                            placeholder="Dirección completa de recogida"
                                            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>

                                    <div className="flex justify-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="h-4 w-0.5 bg-muted-foreground/30" />
                                            <ArrowRight className="h-5 w-5 text-primary rotate-90" />
                                            <div className="h-4 w-0.5 bg-muted-foreground/30" />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-xs font-heading font-bold uppercase text-muted-foreground mb-1.5">
                                            🏁 Punto de Destino
                                        </label>
                                        <input
                                            type="text"
                                            value={form.destino}
                                            onChange={(e) => update("destino", e.target.value)}
                                            placeholder="Dirección completa de entrega"
                                            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Cargo details */}
                    {paso === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="space-y-5"
                        >
                            <div className="rounded-xl border border-border bg-card p-6">
                                <h3 className="text-lg font-heading font-extrabold uppercase mb-5 flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    Tipo de Carga
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                    {tiposCarga.map((tipo) => (
                                        <button
                                            key={tipo.value}
                                            onClick={() => update("tipoCarga", tipo.value)}
                                            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:-translate-y-0.5 ${form.tipoCarga === tipo.value
                                                    ? "border-primary bg-primary/10 shadow-md"
                                                    : "border-border bg-background hover:border-primary/50"
                                                }`}
                                        >
                                            <span className="text-2xl">{tipo.icon}</span>
                                            <span className="text-xs font-heading font-bold uppercase">
                                                {tipo.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-heading font-bold uppercase text-muted-foreground mb-1.5">
                                            <FileText className="inline h-3 w-3 mr-1" />
                                            Descripción de la Carga
                                        </label>
                                        <textarea
                                            value={form.descripcionCarga}
                                            onChange={(e) =>
                                                update("descripcionCarga", e.target.value)
                                            }
                                            placeholder="Describe los artículos a transportar..."
                                            rows={3}
                                            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-heading font-bold uppercase text-muted-foreground mb-1.5">
                                                <Weight className="inline h-3 w-3 mr-1" />
                                                Peso Estimado
                                            </label>
                                            <input
                                                type="text"
                                                value={form.pesoEstimado}
                                                onChange={(e) =>
                                                    update("pesoEstimado", e.target.value)
                                                }
                                                placeholder="Ej: 350 kg"
                                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-heading font-bold uppercase text-muted-foreground mb-1.5">
                                                📝 Notas Adicionales
                                            </label>
                                            <input
                                                type="text"
                                                value={form.notas}
                                                onChange={(e) => update("notas", e.target.value)}
                                                placeholder="Instrucciones especiales"
                                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-6">
                    {paso > 1 ? (
                        <button
                            onClick={() => setPaso(paso - 1)}
                            className="rounded-lg bg-muted px-6 py-3 text-sm font-heading font-bold uppercase text-foreground hover:bg-muted/80 transition-colors"
                        >
                            Anterior
                        </button>
                    ) : (
                        <div />
                    )}

                    {paso < 3 ? (
                        <button
                            onClick={() => setPaso(paso + 1)}
                            disabled={!puedeSiguiente()}
                            className="rounded-lg bg-primary px-6 py-3 text-sm font-heading font-bold uppercase text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Siguiente
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!puedeSiguiente() || enviando}
                            className="rounded-lg bg-primary px-8 py-3 text-sm font-heading font-bold uppercase text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {enviando ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Solicitar Servicio
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Available workers indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex items-center justify-center gap-3 rounded-xl border border-brand-success/30 bg-brand-success/5 p-4"
                >
                    <div className="flex -space-x-2">
                        {trabajadoresDisponibles.slice(0, 3).map((t) => (
                            <div
                                key={t.id}
                                className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-bold text-secondary-foreground"
                            >
                                {t.nombre.charAt(0)}
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className="text-sm font-heading font-bold">
                            <span className="text-brand-success">
                                {trabajadoresDisponibles.length} conductores
                            </span>{" "}
                            disponibles ahora
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Tiempo medio de respuesta: ~3 min
                        </p>
                    </div>
                    <Truck className="h-5 w-5 text-brand-success ml-auto" />
                </motion.div>
            </div>
        </AppLayout>
    );
};

export default SolicitudServicioPage;
