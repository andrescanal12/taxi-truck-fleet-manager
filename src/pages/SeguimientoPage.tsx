import { useState } from "react";
import { motion } from "framer-motion";
import {
    MapPin,
    Clock,
    Phone,
    Truck,
    Package,
    Navigation,
    Radio,
    Eye,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Timer,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useServicios, Servicio, EstadoServicio } from "@/contexts/ServiciosContext";

const estadoConfig: Record<EstadoServicio, { label: string; color: string; bg: string; icon: typeof Clock }> = {
    pendiente: { label: "Pendiente", color: "text-brand-warning", bg: "bg-brand-warning/10", icon: Clock },
    asignado: { label: "Conductor Asignado", color: "text-brand-info", bg: "bg-brand-info/10", icon: Truck },
    en_camino: { label: "En Camino a Recoger", color: "text-brand-info", bg: "bg-brand-info/10", icon: Navigation },
    recogiendo: { label: "Recogiendo Carga", color: "text-brand-warning", bg: "bg-brand-warning/10", icon: Package },
    en_transito: { label: "En Tránsito", color: "text-brand-success", bg: "bg-brand-success/10", icon: Truck },
    entregado: { label: "Entregado", color: "text-brand-success", bg: "bg-brand-success/10", icon: CheckCircle2 },
    completado: { label: "Completado", color: "text-brand-success", bg: "bg-brand-success/10", icon: CheckCircle2 },
    cancelado: { label: "Cancelado", color: "text-destructive", bg: "bg-destructive/10", icon: AlertCircle },
};

const SeguimientoPage = () => {
    const { servicios, serviciosActivos } = useServicios();
    const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);
    const [busqueda, setBusqueda] = useState("");

    const serviciosFiltrados = busqueda
        ? servicios.filter(
            (s) =>
                s.id.toLowerCase().includes(busqueda.toLowerCase()) ||
                s.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                s.origen.toLowerCase().includes(busqueda.toLowerCase()) ||
                s.destino.toLowerCase().includes(busqueda.toLowerCase())
        )
        : serviciosActivos.length > 0
            ? serviciosActivos
            : servicios.slice(0, 5);

    const servActual = seleccionado || serviciosFiltrados[0];
    const config = servActual ? estadoConfig[servActual.estado] : null;

    return (
        <AppLayout title="Seguimiento en Tiempo Real">
            {/* Live pulse indicator */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-success" />
                </div>
                <span className="text-xs font-heading font-bold uppercase text-brand-success tracking-wider">
                    Rastreo Activo
                </span>
                <span className="text-xs text-muted-foreground">
                    · {serviciosActivos.length} servicios en curso
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Service list */}
                <div className="lg:col-span-1 space-y-3">
                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar servicio por ID o nombre..."
                            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                        {serviciosFiltrados.map((s, i) => {
                            const cfg = estadoConfig[s.estado];
                            const isActive = servActual?.id === s.id;
                            return (
                                <motion.button
                                    key={s.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setSeleccionado(s)}
                                    className={`w-full text-left rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${isActive
                                            ? "border-primary bg-primary/5 shadow-md"
                                            : "border-border bg-card"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-sm font-heading font-extrabold">{s.id}</span>
                                        <span className={`text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                                            {cfg.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate mb-1">
                                        <MapPin className="inline h-3 w-3 mr-1" />
                                        {s.origen}
                                    </p>
                                    <p className="text-xs text-foreground truncate">
                                        <Navigation className="inline h-3 w-3 mr-1 text-primary" />
                                        {s.destino}
                                    </p>
                                    {s.progreso > 0 && s.progreso < 100 && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-primary transition-all"
                                                    style={{ width: `${s.progreso}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground">{s.progreso}%</span>
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}

                        {serviciosFiltrados.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Radio className="h-8 w-8 mx-auto mb-3 opacity-40" />
                                <p className="text-sm font-heading font-bold">Sin resultados</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail panel */}
                <div className="lg:col-span-2">
                    {servActual && config ? (
                        <motion.div
                            key={servActual.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-5"
                        >
                            {/* Map placeholder */}
                            <div className="relative rounded-xl border border-border bg-secondary overflow-hidden h-64 sm:h-80">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary-foreground">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 rounded-full bg-primary/20"
                                        />
                                        <div className="relative h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                                            <Truck className="h-8 w-8 text-primary-foreground" />
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm font-heading font-bold uppercase opacity-70">
                                        Mapa de Seguimiento GPS
                                    </p>
                                    <p className="text-xs opacity-50 mt-1">
                                        {servActual.posicionActual
                                            ? `Lat: ${servActual.posicionActual.lat.toFixed(4)}, Lng: ${servActual.posicionActual.lng.toFixed(4)}`
                                            : "Posición no disponible"}
                                    </p>
                                </div>

                                {/* Route indicators overlayed */}
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                    <div className="rounded-lg bg-background/90 backdrop-blur px-3 py-2">
                                        <p className="text-[10px] font-heading font-bold uppercase text-muted-foreground">Origen</p>
                                        <p className="text-xs font-bold text-foreground truncate max-w-[140px]">{servActual.origen.split(",")[0]}</p>
                                    </div>
                                    <div className="flex-1 mx-2 h-0.5 bg-primary/30 relative">
                                        <motion.div
                                            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow-lg"
                                            animate={{ left: [`${servActual.progreso}%`] }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                    <div className="rounded-lg bg-background/90 backdrop-blur px-3 py-2">
                                        <p className="text-[10px] font-heading font-bold uppercase text-muted-foreground">Destino</p>
                                        <p className="text-xs font-bold text-foreground truncate max-w-[140px]">{servActual.destino.split(",")[0]}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status + ETA */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className={`rounded-xl border p-5 ${config.bg} border-transparent`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <config.icon className={`h-5 w-5 ${config.color}`} />
                                        <span className="text-xs font-heading font-bold uppercase text-muted-foreground">Estado</span>
                                    </div>
                                    <p className={`text-lg font-heading font-extrabold ${config.color}`}>
                                        {config.label}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border bg-card p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Timer className="h-5 w-5 text-primary" />
                                        <span className="text-xs font-heading font-bold uppercase text-muted-foreground">ETA</span>
                                    </div>
                                    <p className="text-lg font-heading font-extrabold">
                                        {servActual.etaMinutos ? `${servActual.etaMinutos} min` : "Calculando..."}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-border bg-card p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Eye className="h-5 w-5 text-primary" />
                                        <span className="text-xs font-heading font-bold uppercase text-muted-foreground">Progreso</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-lg font-heading font-extrabold">{servActual.progreso}%</p>
                                        <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${servActual.progreso}%` }}
                                                transition={{ duration: 1 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-xl border border-border bg-card p-5">
                                    <h4 className="text-xs font-heading font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Detalles de la Carga
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tipo</span>
                                            <span className="font-bold capitalize">{servActual.tipoCarga.replace("_", " ")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Descripción</span>
                                            <span className="font-bold text-right max-w-[60%] truncate">{servActual.descripcionCarga}</span>
                                        </div>
                                        {servActual.pesoEstimado && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Peso</span>
                                                <span className="font-bold">{servActual.pesoEstimado}</span>
                                            </div>
                                        )}
                                        {servActual.costoEstimado && (
                                            <div className="flex justify-between border-t border-border pt-2 mt-2">
                                                <span className="text-muted-foreground">Costo Estimado</span>
                                                <span className="font-heading font-extrabold text-primary">€{servActual.costoEstimado}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {servActual.trabajadorNombre ? (
                                    <div className="rounded-xl border border-border bg-card p-5">
                                        <h4 className="text-xs font-heading font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                            <Truck className="h-4 w-4" />
                                            Conductor Asignado
                                        </h4>
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-lg font-heading font-bold text-secondary-foreground">
                                                {servActual.trabajadorNombre.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-heading font-bold">{servActual.trabajadorNombre}</p>
                                                <p className="text-xs text-muted-foreground">ID: {servActual.trabajadorId}</p>
                                            </div>
                                        </div>
                                        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-success/10 text-brand-success px-4 py-2.5 text-sm font-heading font-bold uppercase hover:bg-brand-success/20 transition-colors">
                                            <Phone className="h-4 w-4" />
                                            Contactar Conductor
                                        </button>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-brand-warning/50 bg-brand-warning/5 p-5 flex flex-col items-center justify-center text-center">
                                        <Clock className="h-8 w-8 text-brand-warning mb-2" />
                                        <p className="text-sm font-heading font-bold">Buscando conductor</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Notificando a conductores disponibles en la zona...
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Timeline */}
                            <div className="rounded-xl border border-border bg-card p-5">
                                <h4 className="text-xs font-heading font-bold uppercase text-muted-foreground mb-4">
                                    Línea de Tiempo
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: "Servicio Solicitado", time: servActual.fechaCreacion, done: true },
                                        { label: "Conductor Asignado", time: servActual.fechaAsignacion, done: !!servActual.fechaAsignacion },
                                        {
                                            label: "En Tránsito",
                                            time: servActual.estado === "en_transito" ? "Ahora" : undefined,
                                            done: ["en_transito", "entregado", "completado"].includes(servActual.estado),
                                        },
                                        { label: "Entregado", time: servActual.fechaFinalizacion, done: ["entregado", "completado"].includes(servActual.estado) },
                                        { label: "Albarán y Facturación", time: undefined, done: servActual.estado === "completado" },
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${step.done
                                                            ? "border-brand-success bg-brand-success"
                                                            : "border-muted-foreground/30 bg-background"
                                                        }`}
                                                >
                                                    {step.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                                                </div>
                                                {i < 4 && (
                                                    <div className={`w-0.5 h-6 ${step.done ? "bg-brand-success" : "bg-muted"}`} />
                                                )}
                                            </div>
                                            <div className="flex-1 -mt-0.5">
                                                <p className={`text-sm font-heading font-bold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                                                    {step.label}
                                                </p>
                                                {step.time && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {step.time === "Ahora"
                                                            ? "Ahora"
                                                            : new Date(step.time).toLocaleString("es-ES", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                day: "2-digit",
                                                                month: "short",
                                                            })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                            <Radio className="h-12 w-12 mb-4 opacity-30" />
                            <p className="font-heading font-bold">Selecciona un servicio</p>
                            <p className="text-sm mt-1">Elige un servicio de la lista para ver su seguimiento en tiempo real</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default SeguimientoPage;
