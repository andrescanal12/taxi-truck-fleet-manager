import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Truck,
    MapPin,
    Phone,
    Star,
    CheckCircle2,
    XCircle,
    Navigation,
    Camera,
    Euro,
    Clock,
    Package,
    Bell,
    TrendingUp,
    AlertTriangle,
    Shield,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useServicios, Servicio, Trabajador } from "@/contexts/ServiciosContext";

const TrabajadoresPage = () => {
    const {
        trabajadores,
        serviciosPendientes,
        serviciosActivos,
        asignarTrabajador,
        completarServicio,
        actualizarEstadoServicio,
    } = useServicios();

    const [vistaActiva, setVistaActiva] = useState<"panel" | "servicios" | "finalizar">("panel");
    const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState<Trabajador | null>(null);
    const [servicioAFinalizar, setServicioAFinalizar] = useState<Servicio | null>(null);
    const [costoFinal, setCostoFinal] = useState("");
    const [showNotificacion, setShowNotificacion] = useState(false);

    const handleAceptarServicio = (servicioId: string, trabajadorId: string) => {
        asignarTrabajador(servicioId, trabajadorId);
        setShowNotificacion(true);
        setTimeout(() => setShowNotificacion(false), 3000);
    };

    const handleIniciarTransito = (servicioId: string) => {
        actualizarEstadoServicio(servicioId, "en_transito", { progreso: 10 });
    };

    const handleFinalizarServicio = () => {
        if (servicioAFinalizar && costoFinal) {
            completarServicio(servicioAFinalizar.id, parseFloat(costoFinal));
            setServicioAFinalizar(null);
            setCostoFinal("");
            setVistaActiva("panel");
        }
    };

    return (
        <AppLayout title="Panel de Conductores">
            {/* Notification toast */}
            <AnimatePresence>
                {showNotificacion && (
                    <motion.div
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        className="fixed top-4 right-4 z-50 rounded-xl border border-brand-success/40 bg-brand-success/10 backdrop-blur-lg p-4 shadow-xl flex items-center gap-3"
                    >
                        <CheckCircle2 className="h-5 w-5 text-brand-success" />
                        <div>
                            <p className="text-sm font-heading font-bold">¡Servicio Aceptado!</p>
                            <p className="text-xs text-muted-foreground">La ruta GPS se ha generado automáticamente</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tab switches */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {[
                    { id: "panel", label: "Mi Panel", icon: Shield },
                    { id: "servicios", label: `Servicios Pendientes (${serviciosPendientes.length})`, icon: Bell },
                    { id: "finalizar", label: "Finalizar Servicio", icon: Camera },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setVistaActiva(tab.id as typeof vistaActiva)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-heading font-bold uppercase whitespace-nowrap transition-all ${vistaActiva === tab.id
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "bg-card text-foreground border border-border hover:border-primary"
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* Panel view */}
                {vistaActiva === "panel" && (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {/* Drivers list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {trabajadores.map((t, i) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setTrabajadorSeleccionado(t)}
                                    className={`rounded-xl border p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${trabajadorSeleccionado?.id === t.id
                                            ? "border-primary bg-primary/5"
                                            : "border-border bg-card"
                                        }`}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-xl font-heading font-bold text-secondary-foreground">
                                                {t.nombre.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                                            </div>
                                            <div
                                                className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card ${t.estado === "disponible"
                                                        ? "bg-brand-success"
                                                        : t.estado === "en_servicio"
                                                            ? "bg-brand-warning"
                                                            : "bg-muted-foreground"
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-heading font-extrabold">{t.nombre}</p>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {t.estado.replace("_", " ")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Truck className="h-3.5 w-3.5" />
                                            <span className="font-bold">{t.vehiculo}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">{t.matricula}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                                                <span className="font-heading font-bold">{t.valoracion}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <TrendingUp className="h-3.5 w-3.5" />
                                                <span className="font-bold">{t.serviciosCompletados} servicios</span>
                                            </div>
                                        </div>
                                    </div>

                                    {t.estado === "disponible" && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">{t.telefono}</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Active services for drivers */}
                        {serviciosActivos.length > 0 && (
                            <div>
                                <h3 className="text-lg font-heading font-extrabold uppercase mb-4 flex items-center gap-2">
                                    <Navigation className="h-5 w-5 text-primary" />
                                    Servicios en Curso
                                </h3>
                                <div className="space-y-3">
                                    {serviciosActivos.map((s) => (
                                        <div
                                            key={s.id}
                                            className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm font-heading font-extrabold">{s.id}</span>
                                                    <span className="text-xs font-heading font-bold uppercase text-brand-info bg-brand-info/10 px-2 py-0.5 rounded-full">
                                                        {s.estado.replace("_", " ")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{s.origen}</span>
                                                    <span>→</span>
                                                    <span className="text-foreground font-bold">{s.destino}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="h-1.5 flex-1 max-w-xs rounded-full bg-muted overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-primary transition-all"
                                                            style={{ width: `${s.progreso}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold">{s.progreso}%</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {s.estado === "asignado" && (
                                                    <button
                                                        onClick={() => handleIniciarTransito(s.id)}
                                                        className="rounded-lg bg-brand-info px-4 py-2 text-sm font-heading font-bold uppercase text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                                                    >
                                                        <Navigation className="h-4 w-4" />
                                                        Iniciar Ruta
                                                    </button>
                                                )}
                                                {["en_transito", "en_camino"].includes(s.estado) && (
                                                    <button
                                                        onClick={() => {
                                                            setServicioAFinalizar(s);
                                                            setCostoFinal(String(s.costoEstimado || ""));
                                                            setVistaActiva("finalizar");
                                                        }}
                                                        className="rounded-lg bg-brand-success px-4 py-2 text-sm font-heading font-bold uppercase text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Finalizar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Pending services */}
                {vistaActiva === "servicios" && (
                    <motion.div
                        key="servicios"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {serviciosPendientes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                <p className="text-lg font-heading font-bold text-muted-foreground">
                                    No hay servicios pendientes
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Todos los servicios están asignados o completados
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {serviciosPendientes.map((s, i) => (
                                    <motion.div
                                        key={s.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="rounded-xl border border-brand-warning/30 bg-brand-warning/5 p-6"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Bell className="h-5 w-5 text-brand-warning animate-bounce" />
                                                    <span className="text-lg font-heading font-extrabold">{s.id}</span>
                                                    <span className="text-xs font-heading font-bold uppercase text-brand-warning bg-brand-warning/10 px-2 py-0.5 rounded-full">
                                                        Nueva solicitud
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground font-heading font-bold uppercase mb-1">Cliente</p>
                                                        <p className="font-bold">{s.clienteNombre}</p>
                                                        <p className="text-xs text-muted-foreground">{s.clienteTelefono}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground font-heading font-bold uppercase mb-1">Carga</p>
                                                        <p className="font-bold capitalize">{s.tipoCarga.replace("_", " ")}</p>
                                                        <p className="text-xs text-muted-foreground">{s.pesoEstimado}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground font-heading font-bold uppercase mb-1">📍 Origen</p>
                                                        <p className="font-bold">{s.origen}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground font-heading font-bold uppercase mb-1">🏁 Destino</p>
                                                        <p className="font-bold">{s.destino}</p>
                                                    </div>
                                                </div>

                                                {s.costoEstimado && (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <Euro className="h-4 w-4 text-primary" />
                                                        <span className="font-heading font-extrabold text-primary">
                                                            €{s.costoEstimado}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">estimado</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex sm:flex-col gap-2">
                                                {trabajadores
                                                    .filter((t) => t.estado === "disponible")
                                                    .slice(0, 2)
                                                    .map((t) => (
                                                        <button
                                                            key={t.id}
                                                            onClick={() => handleAceptarServicio(s.id, t.id)}
                                                            className="flex-1 sm:flex-none rounded-lg bg-brand-success px-4 py-3 text-sm font-heading font-bold uppercase text-white hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            {t.nombre.split(" ")[0]}
                                                        </button>
                                                    ))}
                                                <button className="flex-1 sm:flex-none rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm font-heading font-bold uppercase hover:bg-destructive/20 transition-colors flex items-center gap-2 justify-center">
                                                    <XCircle className="h-4 w-4" />
                                                    Rechazar
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Finalize service */}
                {vistaActiva === "finalizar" && (
                    <motion.div
                        key="finalizar"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-xl mx-auto"
                    >
                        {servicioAFinalizar ? (
                            <div className="space-y-5">
                                <div className="rounded-xl border border-border bg-card p-6">
                                    <h3 className="text-lg font-heading font-extrabold uppercase mb-3 flex items-center gap-2">
                                        <Camera className="h-5 w-5 text-primary" />
                                        Finalizar Servicio {servicioAFinalizar.id}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Registra la entrega del servicio, captura el albarán y confirma el costo final.
                                    </p>

                                    {/* Photo capture area */}
                                    <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center mb-6 cursor-pointer hover:border-primary/60 transition-colors">
                                        <Camera className="h-10 w-10 text-primary mx-auto mb-3" />
                                        <p className="text-sm font-heading font-bold uppercase">
                                            Capturar Foto del Albarán
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Toca para abrir la cámara o seleccionar imagen
                                        </p>
                                    </div>

                                    {/* Cost */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-heading font-bold uppercase text-muted-foreground mb-1.5">
                                                <Euro className="inline h-3 w-3 mr-1" />
                                                Costo Final del Servicio
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-bold">
                                                    €
                                                </span>
                                                <input
                                                    type="number"
                                                    value={costoFinal}
                                                    onChange={(e) => setCostoFinal(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full rounded-lg border border-input bg-background pl-8 pr-4 py-3 text-xl font-heading font-extrabold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                />
                                            </div>
                                            {servicioAFinalizar.costoEstimado && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Costo estimado original:{" "}
                                                    <span className="font-bold">€{servicioAFinalizar.costoEstimado}</span>
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 rounded-lg bg-brand-info/10 border border-brand-info/20 p-3">
                                            <AlertTriangle className="h-4 w-4 text-brand-info flex-shrink-0" />
                                            <p className="text-xs text-brand-info">
                                                El albarán se almacenará automáticamente y se incluirá en la próxima facturación trimestral.
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleFinalizarServicio}
                                            disabled={!costoFinal}
                                            className="w-full rounded-lg bg-brand-success px-6 py-4 text-sm font-heading font-bold uppercase text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="h-5 w-5" />
                                            Confirmar Entrega y Generar Albarán
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Camera className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                <p className="text-lg font-heading font-bold text-muted-foreground">
                                    Selecciona un servicio activo para finalizar
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Ve al panel principal y haz clic en "Finalizar" en un servicio en curso
                                </p>
                                <button
                                    onClick={() => setVistaActiva("panel")}
                                    className="mt-4 rounded-lg bg-primary px-6 py-3 text-sm font-heading font-bold uppercase text-primary-foreground hover:opacity-90 transition-opacity"
                                >
                                    Ir al Panel
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
};

export default TrabajadoresPage;
